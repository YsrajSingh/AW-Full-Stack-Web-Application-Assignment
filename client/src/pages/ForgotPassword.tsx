import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { Mail } from "lucide-react";
import { forgotPassword } from "@/api/auth";

type ForgotPasswordForm = {
  email: string;
};

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setLoading(true);
      await forgotPassword(data.email);
      toast({
        title: "Success",
        description: "If an account exists with that email, you will receive password reset instructions.",
      });
      navigate("/login");
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
          <CardDescription>
            Enter your email address and we'll send you instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: true })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Instructions
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}