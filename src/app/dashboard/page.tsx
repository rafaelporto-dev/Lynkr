"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../supabase/client";
import LinksList from "@/components/links-list";
import LinkForm from "@/components/link-form";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  PlusCircle,
  FileEdit,
  ExternalLink,
  Pencil,
  Save,
  Loader2,
  X,
  Camera,
  Upload,
  UserCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarCropModal from "@/components/avatar-crop-modal";

export default function DashboardPage() {
  const [username, setUsername] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, full_name, bio, avatar_url")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUsername(profile.username || "");
          setFullName(profile.full_name || "");
          setBio(profile.bio || "");
          setAvatarUrl(profile.avatar_url);
          setProfileUrl(`${window.location.origin}/${profile.username}`);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);

      toast({
        title: "Link copied!",
        description: "Your link has been copied to the clipboard.",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error copying link",
        description: "Unable to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVisitProfile = () => {
    window.open(profileUrl, "_blank");
  };

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
    await uploadAvatar(croppedImageBlob);
  };

  const uploadAvatar = async (blob: Blob) => {
    setUploadingAvatar(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You need to be logged in to update your profile");
      }

      const fileExt = "jpeg";
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      // Criar um arquivo a partir do blob
      const file = new File([blob], fileName, { type: `image/${fileExt}` });

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      const avatar_url = data.publicUrl;

      // Atualizar perfil com a nova URL da imagem
      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      // Atualizar estado local
      setAvatarUrl(avatar_url);

      toast({
        title: "Profile photo updated",
        description: "Your profile photo has been updated successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Error updating profile photo",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveProfileChanges = async () => {
    setIsSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You need to be logged in to update your profile");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your information has been updated successfully.",
      });

      setIsEditingProfile(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Error updating profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Coluna Esquerda - Preview e Informações */}
      <div className="md:w-1/3 space-y-6">
        {/* Painel de Perfil */}
        <div className="rounded-xl bg-card shadow-lg border p-6 space-y-4">
          <div className="h-[150px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-indigo-900 via-gray-900 to-black flex items-center justify-center">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-white/50">
                <AvatarImage
                  src={avatarUrl || undefined}
                  alt={fullName || username || "Usuário"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-3xl font-bold">
                  {username ? username.charAt(0).toUpperCase() : "L"}
                </AvatarFallback>
              </Avatar>
              <label
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
              </label>
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-y-2">
            {isEditingProfile ? (
              <div className="space-y-4 px-2">
                <div>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Display name"
                    className="text-center"
                  />
                </div>
                <div>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a small description about yourself or your work. Ex: Graphic designer specialized in visual identity | @instagram"
                    className="min-h-[80px] text-center"
                  />
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setIsEditingProfile(false)}
                    disabled={isSaving}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveProfileChanges}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-1 h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold">
                  {fullName || `@${username || "user"}`}
                </h2>
                {bio && <p className="text-muted-foreground text-sm">{bio}</p>}
                <div className="flex items-center justify-center">
                  <div className="text-sm rounded-full bg-muted/30 px-3 py-1 flex items-center gap-2 max-w-[260px]">
                    <span className="truncate">
                      {profileUrl || "lynkr.me/your-username"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
                      onClick={handleCopyUrl}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {!isEditingProfile && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsEditingProfile(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit profile
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleVisitProfile}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit my profile
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/personalization")}
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Personalize theme
            </Button>
          </div>
        </div>

        {/* Formulário para adicionar link */}
        {isAddingLink ? (
          <div className="rounded-xl bg-card shadow-lg border">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Add new link</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingLink(false)}
              >
                Cancel
              </Button>
            </div>
            <div className="p-4">
              <LinkForm />
            </div>
          </div>
        ) : (
          <Button className="w-full py-6" onClick={() => setIsAddingLink(true)}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add new link
          </Button>
        )}
      </div>

      {/* Coluna Direita - Lista de Links */}
      <div className="md:w-2/3 rounded-xl bg-card shadow-lg border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Your links</h2>
          <p className="text-sm text-muted-foreground">
            Drag to reorder. Click the button to activate/deactivate.
          </p>
        </div>
        <div className="p-4">
          <LinksList />
        </div>
      </div>

      {/* Modal para recortar a imagem */}
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
    </main>
  );
}
