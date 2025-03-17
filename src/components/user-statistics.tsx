"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Loader2,
  BarChart2,
  TrendingUp,
  MousePointerClick,
  Calendar as CalendarIcon,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Link as LinkIcon,
  Clock,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

type LinkStat = {
  id: string;
  title: string;
  click_count: number;
  url: string;
};

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type DateFilter = {
  label: string;
  value: string;
  range: () => DateRange;
};

const dateFilters: DateFilter[] = [
  {
    label: "Last 7 days",
    value: "7",
    range: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 30 days",
    value: "30",
    range: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 90 days",
    value: "90",
    range: () => ({
      from: startOfDay(subDays(new Date(), 89)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "All time",
    value: "0",
    range: () => ({ from: undefined, to: undefined }),
  },
];

export default function UserStatistics() {
  const [stats, setStats] = useState<LinkStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalClicks, setTotalClicks] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("7");
  const supabase = createClient();

  const applyDateFilter = (filter: string) => {
    setSelectedFilter(filter);
    if (filter !== "0") {
      const newRange = dateFilters.find((f) => f.value === filter)?.range() || {
        from: undefined,
        to: undefined,
      };
      setDateRange(newRange);
    }
    fetchStats(
      filter === "0"
        ? dateRange
        : dateFilters.find((f) => f.value === filter)?.range()
    );
  };

  async function fetchStats(range?: DateRange) {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to view statistics");
        return;
      }

      let query = supabase
        .from("links")
        .select("id, title, click_count, url")
        .eq("user_id", user.id);

      // Apply date filtering if we have click_timestamps in the future
      // This is a placeholder for when we implement click timestamps
      // For now, we're just filtering the links themselves

      const { data, error: fetchError } = await query.order("click_count", {
        ascending: false,
      });

      if (fetchError) throw fetchError;

      setStats(data || []);
      setTotalClicks(
        data?.reduce((sum, link) => sum + link.click_count, 0) || 0
      );
    } catch (err: any) {
      setError(err.message || "Failed to load statistics");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();

    // Set up realtime subscription
    const channel = supabase
      .channel("links-stats-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "links" },
        () => fetchStats(dateRange.from && dateRange.to ? dateRange : undefined)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate the max click count for visualization
  const maxClicks = Math.max(...stats.map((link) => link.click_count), 1);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Link Analytics</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            <span>Link Analytics</span>
          </CardTitle>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2">
              {dateFilters.slice(0, 4).map((filter) => (
                <Button
                  key={filter.value}
                  variant={
                    selectedFilter === filter.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => applyDateFilter(filter.value)}
                  className="text-xs h-8"
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={selectedFilter === "0" ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "justify-start text-xs h-8 font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {dateRange.from && dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, yyyy", { locale: ptBR })}{" "}
                      - {format(dateRange.to, "LLL dd, yyyy", { locale: ptBR })}
                    </>
                  ) : (
                    <span>Custom Range</span>
                  )}
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      const newRange = {
                        from: startOfDay(range.from),
                        to: endOfDay(range.to),
                      };
                      setDateRange(newRange);
                      setSelectedFilter("0");
                      fetchStats(newRange);
                      setIsCalendarOpen(false);
                    } else {
                      setDateRange({ from: range?.from, to: range?.to });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                <MousePointerClick size={24} />
              </div>
              <h3 className="text-2xl font-bold">{totalClicks}</h3>
              <p className="text-sm text-muted-foreground">Total Clicks</p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-2xl font-bold">
                {stats.length > 0 ? Math.round(totalClicks / stats.length) : 0}
              </h3>
              <p className="text-sm text-muted-foreground">
                Avg. Clicks Per Link
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-2xl font-bold">
                {stats.length > 0 ? stats[0]?.click_count || 0 : 0}
              </h3>
              <p className="text-sm text-muted-foreground">Most Popular Link</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Clicks by Link</h3>
          {dateRange.from && dateRange.to && selectedFilter !== "0" && (
            <Badge variant="outline" className="text-xs">
              {format(dateRange.from, "MMM d, yyyy", { locale: ptBR })} -{" "}
              {format(dateRange.to, "MMM d, yyyy", { locale: ptBR })}
            </Badge>
          )}
        </div>

        {stats.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No link data available yet.</p>
            <p className="text-sm mt-1">Add links to start tracking clicks.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.map((link) => (
              <div key={link.id} className="p-3 bg-card border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium truncate mr-2">{link.title}</div>
                  <Badge variant="secondary" className="shrink-0">
                    {link.click_count} clicks
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{
                      width: `${(link.click_count / maxClicks) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground truncate">
                  {link.url}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
