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
  Globe,
  ArrowRightLeft,
  ExternalLink,
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

type SourceStat = {
  source: string;
  count: number;
  percentage: number;
  color: string;
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
  const [sourcesStats, setSourcesStats] = useState<SourceStat[]>([]);
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

      const { data, error: fetchError } = await query.order("click_count", {
        ascending: false,
      });

      if (fetchError) throw fetchError;

      setStats(data || []);
      setTotalClicks(
        data?.reduce((sum, link) => sum + link.click_count, 0) || 0
      );

      // Fetch traffic source statistics
      let linksIds = data?.map((link) => link.id) || [];

      if (linksIds.length > 0) {
        // Build query to fetch traffic sources
        let clicksQuery = supabase
          .from("clicks")
          .select("source, link_id, created_at")
          .in("link_id", linksIds);

        // Apply date filtering if provided
        if (range?.from && range?.to) {
          clicksQuery = clicksQuery
            .gte("created_at", range.from.toISOString())
            .lte("created_at", range.to.toISOString());
        }

        const { data: sourcesData, error: sourcesError } = await clicksQuery;

        if (sourcesError) throw sourcesError;

        // Calculate source statistics
        if (sourcesData && sourcesData.length > 0) {
          // Group by source
          const sourceGroups = sourcesData.reduce(
            (acc, item) => {
              const source = item.source || "direct";
              acc[source] = (acc[source] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          );

          // Colors for common sources
          const sourceColors: Record<string, string> = {
            direct: "bg-gray-500",
            facebook: "bg-blue-600",
            instagram: "bg-pink-600",
            twitter: "bg-blue-400",
            linkedin: "bg-blue-700",
            google: "bg-red-500",
            youtube: "bg-red-600",
            bing: "bg-cyan-600",
          };

          // Convert to array and calculate percentages
          const totalSourceClicks = sourcesData.length;
          const sourceStats: SourceStat[] = Object.entries(sourceGroups)
            .map(([source, count]) => ({
              source,
              count,
              percentage: Math.round((count / totalSourceClicks) * 100),
              color: sourceColors[source.toLowerCase()] || "bg-purple-500",
            }))
            .sort((a, b) => b.count - a.count);

          setSourcesStats(sourceStats);
        } else {
          setSourcesStats([]);
        }
      } else {
        setSourcesStats([]);
      }
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

        {/* Summary statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-background border rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="rounded-full p-3 bg-primary/10 text-primary flex-shrink-0">
                <MousePointerClick size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Clicks
                </p>
                <h3 className="text-2xl font-bold">{totalClicks}</h3>
                {totalClicks > 0 && (
                  <div className="flex items-center gap-1 text-xs text-primary mt-1">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>All time</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-background border rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="rounded-full p-3 bg-primary/10 text-primary flex-shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Avg Per Link
                </p>
                <h3 className="text-2xl font-bold">
                  {stats.length > 0
                    ? Math.round(totalClicks / stats.length)
                    : 0}
                </h3>
                {stats.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-emerald-500 mt-1">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>{stats.length} active links</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-background border rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="rounded-full p-3 bg-primary/10 text-primary flex-shrink-0">
                <BarChart2 size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Most Popular Link
                </p>
                <h3 className="text-2xl font-bold">
                  {stats.length > 0 ? stats[0]?.click_count || 0 : 0}
                </h3>
                {stats.length > 0 && stats[0] && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground truncate mt-1 max-w-[150px]">
                    <LinkIcon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{stats[0]?.title}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Sources Section */}
        {sourcesStats.length === 0 && stats.length === 0 ? (
          <div className="text-center py-8 px-4 bg-background rounded-md border border-dashed">
            <Globe className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="font-medium text-muted-foreground">
              No data available
            </p>
            <p className="text-sm mt-1 text-muted-foreground/80 max-w-md mx-auto">
              Add links to your profile and share them to start tracking clicks
              and traffic sources.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sourcesStats.length > 0 && (
              <div className="border rounded-lg p-6 bg-card/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5 text-primary" />
                    <span>Traffic Sources</span>
                  </h3>

                  {dateRange.from && dateRange.to && (
                    <Badge variant="outline" className="text-xs">
                      {format(dateRange.from, "MMM d, yyyy", { locale: ptBR })}{" "}
                      - {format(dateRange.to, "MMM d, yyyy", { locale: ptBR })}
                    </Badge>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Chart and list in flexible layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pie chart */}
                    <div className="lg:col-span-1 bg-background rounded-lg border p-4 flex flex-col items-center justify-center">
                      <div className="h-48 w-48 rounded-full border-8 border-muted relative flex items-center justify-center overflow-hidden">
                        {sourcesStats.map((source, index, arr) => {
                          const startPercentage = arr
                            .slice(0, index)
                            .reduce((acc, s) => acc + s.percentage, 0);
                          const startAngle = (startPercentage / 100) * 360;
                          const endAngle =
                            ((startPercentage + source.percentage) / 100) * 360;

                          return (
                            <div
                              key={source.source}
                              className={`absolute inset-0 ${source.color}`}
                              style={{
                                clipPath: `conic-gradient(from ${startAngle}deg, transparent ${startAngle}deg, ${source.color} ${startAngle}deg, ${source.color} ${endAngle}deg, transparent ${endAngle}deg)`,
                              }}
                            />
                          );
                        })}
                        <div className="bg-background h-36 w-36 rounded-full flex items-center justify-center z-10 shadow-inner">
                          <Globe className="h-12 w-12 text-primary/40" />
                        </div>
                      </div>

                      <p className="text-sm text-center mt-3 text-muted-foreground">
                        Total of{" "}
                        {sourcesStats.reduce(
                          (sum, source) => sum + source.count,
                          0
                        )}{" "}
                        tracked clicks
                      </p>
                    </div>

                    {/* Sources list */}
                    <div className="lg:col-span-2 bg-background rounded-lg border p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sourcesStats.map((source) => (
                          <div
                            key={source.source}
                            className="flex items-center gap-3 p-3 rounded-md border bg-card/50 hover:bg-card transition-colors"
                          >
                            <div
                              className={`w-4 h-4 rounded-full ${source.color} flex-shrink-0`}
                            />
                            <div className="flex-grow min-w-0">
                              <div className="flex justify-between items-center">
                                <span className="capitalize font-medium truncate">
                                  {source.source}
                                </span>
                                <span className="ml-2 text-sm font-semibold">
                                  {source.percentage}%
                                </span>
                              </div>
                              <div className="mt-1 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`${source.color.replace("bg-", "bg-")} h-full rounded-full`}
                                  style={{ width: `${source.percentage}%` }}
                                />
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {source.count}{" "}
                                {source.count === 1 ? "click" : "clicks"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Optimization Tips */}
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">
                          Optimization Tips
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {sourcesStats.length > 0 &&
                          sourcesStats[0].source !== "direct" ? (
                            <>
                              Most of your traffic comes from{" "}
                              <span className="font-medium text-foreground">
                                {sourcesStats[0].source}
                              </span>
                              . Continue promoting your links on this platform
                              for better reach.
                            </>
                          ) : (
                            <>
                              Most of your traffic is direct. Consider using UTM
                              parameters to track your campaigns more
                              accurately.
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Links Performance Section */}
            {stats.length > 0 && (
              <div className="border rounded-lg p-6 bg-card/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    <span>Links Performance</span>
                  </h3>
                  {dateRange.from && dateRange.to && (
                    <Badge variant="outline" className="text-xs">
                      {format(dateRange.from, "MMM d, yyyy", { locale: ptBR })}{" "}
                      - {format(dateRange.to, "MMM d, yyyy", { locale: ptBR })}
                    </Badge>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Links grid - 1 column on mobile, 2 on larger screens */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.map((link) => (
                      <div
                        key={link.id}
                        className="p-4 bg-background border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-medium truncate mr-2 text-foreground">
                            {link.title}
                          </div>
                          <Badge
                            variant="secondary"
                            className="shrink-0 flex items-center gap-1"
                          >
                            <MousePointerClick className="h-3 w-3" />
                            {link.click_count}
                          </Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden mb-3">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(5, (link.click_count / maxClicks) * 100)}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{link.url}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Performance Insights */}
                  {stats.length > 1 && (
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 mt-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            Performance Insights
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Your most clicked link is{" "}
                            <span className="font-medium text-foreground">
                              {stats[0].title}
                            </span>{" "}
                            with
                            {stats.length > 1 &&
                              ` ${Math.round((stats[0].click_count / totalClicks) * 100)}% of total clicks. `}
                            {stats.length > 1 &&
                              stats[0].click_count > stats[1].click_count * 2 &&
                              "Consider analyzing what makes this link so effective and apply similar strategies to your other links."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
