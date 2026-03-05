import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Loader2, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCreateOrUpdateProfile, useMyProfile } from "../hooks/useQueries";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileEditDialog({
  open,
  onOpenChange,
}: ProfileEditDialogProps) {
  const { data: profile } = useMyProfile();
  const updateProfile = useCreateOrUpdateProfile();

  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");

  // Sync form when profile loads or dialog opens
  useEffect(() => {
    if (open && profile) {
      setDisplayName(profile.displayName ?? "");
      setPhoneNumber(profile.phoneNumber ?? "");
      setInstagramHandle(
        profile.instagramHandle ? `@${profile.instagramHandle}` : "",
      );
    }
  }, [open, profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("Display name is required");
      return;
    }
    try {
      await updateProfile.mutateAsync({
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim() || null,
        instagramHandle: instagramHandle.trim()
          ? instagramHandle.trim().replace(/^@/, "")
          : null,
      });
      toast.success("Profile updated!");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="profile.dialog"
        className="rounded-2xl border-border max-w-md"
        style={{ background: "oklch(0.18 0.022 268)" }}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Update your display name and contact info. Classmates can reach you
            via phone or Instagram.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="flex flex-col gap-4 py-2">
          {/* Display Name */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="edit-displayName"
              className="text-foreground font-medium text-sm flex items-center gap-2"
            >
              <User className="w-4 h-4 text-primary" />
              Display Name <span className="text-xs text-destructive">*</span>
            </Label>
            <Input
              id="edit-displayName"
              data-ocid="profile.input"
              type="text"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-10 rounded-xl border-border bg-secondary/40 focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="edit-phone"
              className="text-foreground font-medium text-sm flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-muted-foreground" />
              Phone Number
            </Label>
            <Input
              id="edit-phone"
              data-ocid="profile.phone_input"
              type="tel"
              placeholder="+1 234 567 8900"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="h-10 rounded-xl border-border bg-secondary/40 focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Instagram */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="edit-instagram"
              className="text-foreground font-medium text-sm flex items-center gap-2"
            >
              <Instagram className="w-4 h-4 text-muted-foreground" />
              Instagram
            </Label>
            <Input
              id="edit-instagram"
              data-ocid="profile.instagram_input"
              type="text"
              placeholder="@yourhandle"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              className="h-10 rounded-xl border-border bg-secondary/40 focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <DialogFooter className="gap-2 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              data-ocid="profile.cancel_button"
              className="rounded-xl text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="profile.save_button"
              disabled={updateProfile.isPending || !displayName.trim()}
              className="rounded-xl font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.19 28) 0%, oklch(0.65 0.21 22) 100%)",
                color: "oklch(0.99 0 0)",
                boxShadow: "0 4px 12px oklch(0.72 0.19 28 / 0.3)",
              }}
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
