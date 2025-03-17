"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Upload, Save, Loader2, Camera } from "lucide-react";
import { FormMessage } from "@/components/form-message";
import AvatarCropModal from "./avatar-crop-modal";
import { useToast } from "@/components/ui/use-toast";

const themes = [
  { id: "default", name: "Default", color: "bg-primary" },
  { id: "purple", name: "Purple Neon", color: "bg-purple-600" },
  { id: "blue", name: "Blue Neon", color: "bg-blue-600" },
  { id: "cyan", name: "Cyan Future", color: "bg-cyan-500" },
  { id: "indigo", name: "Indigo Night", color: "bg-indigo-600" },
];

export default function ProfileEditor() {
  const supabase = createClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [profile, setProfile] = useState<{
    id: string;
    username: string | null;
    full_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    theme: string | null;
  } | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          setProfile(data);
        }
      } catch (error: any) {
        setMessage({ type: "error", text: error.message });
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Create a temporary URL for the crop modal
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageSrc(reader.result as string);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    // Create a file from the blob
    const fileExtension = "jpeg";
    const croppedFile = new File(
      [croppedImageBlob],
      `cropped-avatar.${fileExtension}`,
      { type: `image/${fileExtension}` },
    );

    setAvatarFile(croppedFile);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(croppedFile);

    // Upload the cropped image immediately
    await uploadAvatar(croppedFile);
  };

  const uploadAvatar = async (file: File) => {
    if (!profile) return;

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split(".").pop() || "jpeg";
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

      const avatar_url = data.publicUrl;

      // Update profile with new avatar URL
      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      // Update profile state with new avatar URL
      setProfile((prev) => (prev ? { ...prev, avatar_url } : null));

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating avatar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleThemeChange = (value: string) => {
    setProfile((prev) => (prev ? { ...prev, theme: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!profile) throw new Error("No profile data");

      // Update profile (avatar is handled separately now)
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          theme: profile.theme,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Customize how your profile appears to visitors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <FormMessage
              message={{
                [message.type]: message.text,
              }}
            />
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  <AvatarImage
                    src={avatarPreview || profile.avatar_url || undefined}
                    alt={profile.full_name || profile.username || "User"}
                  />
                  <AvatarFallback>
                    <UserCircle className="h-20 w-20 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>

                <Label
                  htmlFor="avatar"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera size={20} />
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="sr-only"
                    disabled={uploadingAvatar}
                  />
                </Label>

                {uploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <Label
                  htmlFor="avatar-btn"
                  className="relative cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-md text-sm flex items-center gap-2"
                >
                  <Upload size={16} />
                  <span>Change Photo</span>
                  <Input
                    id="avatar-btn"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="sr-only"
                    disabled={uploadingAvatar}
                  />
                </Label>
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-[200px]">
                Click on the avatar or button to upload a new profile picture
              </p>
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={profile.username || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Your unique username cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">Display Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={profile.full_name || ""}
                  onChange={handleInputChange}
                  placeholder="Your display name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profile.bio || ""}
                  onChange={handleInputChange}
                  placeholder="Tell visitors about yourself"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Profile Theme</Label>
                <Select
                  value={profile.theme || "default"}
                  onValueChange={handleThemeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <SelectItem
                        key={theme.id}
                        value={theme.id}
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full ${theme.color}`}
                          />
                          {theme.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <CardFooter className="px-0 pt-4">
            <Button type="submit" disabled={loading} className="ml-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>

      {/* Crop Modal */}
      {tempImageSrc && (
        <AvatarCropModal
          isOpen={cropModalOpen}
          onClose={() => {
            setCropModalOpen(false);
            setTempImageSrc(null);
          }}
          imageSrc={tempImageSrc}
          onCropComplete={handleCropComplete}
        />
      )}
    </Card>
  );
}
