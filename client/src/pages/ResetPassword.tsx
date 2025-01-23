import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { Key } from "lucide-react";
import { resetPassword } from "@/api/auth";

type ResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

export function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { register, handleSubmit, watch } = useForm<ResetPasswordForm>();

  const onSubmit = async (data: ResetPasswordForm) => {
    if (data.password !== data.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword(token!, data.password);

      // Store the new tokens
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      toast({
        title: "Success",
        description: "Password has been reset successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                {...register("password", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                {...register("confirmPassword", { required: true })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Resetting..."
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Reset Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}