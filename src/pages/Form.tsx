import { useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FormData {
  name: string;
  email: string;
}

const Form = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { won, score } = location.state || { won: false, score: 0 };

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://gcc-backend.bulliontradingcenter.com/website/form/contact",
        {
          name: formData.name,
          email: formData.email,
          category_id: 78,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Contact form response:", response.data);

      toast.success("Form submitted successfully");
      setIsSubmitted(true);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitWithSuccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Form submitted successfully");
      setIsSubmitted(true);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      // Even on error, we simulate success per requirement
      toast.success("Form submitted successfully");
      setIsSubmitted(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(324_82%_83%_/_0.1),transparent_70%)]"></div>
        </div>

        <Card className="w-full max-w-md mx-4 bg-secondary/50 border-primary relative z-10 animate-fade-in">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-success-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">Success!</h2>
              <p className="text-foreground">
                You've been entered into the draw!
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Redirecting to homepage in 3 seconds...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(324_82%_83%_/_0.1),transparent_70%)]"></div>
      </div>

      {/* Form Card */}
      <Card className="w-full max-w-md bg-secondary/50 border-primary relative z-10 animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
              won ? "bg-success" : "bg-danger"
            }`}
          >
            {won ? (
              <svg
                className="w-8 h-8 text-success-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-danger-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-primary">
              {won ? "Congratulations!" : "Better Luck Next Time"}
            </CardTitle>
            <CardDescription className="text-foreground">
              {won
                ? `You scored ${score} point${
                    score !== 1 ? "s" : ""
                  }! Enter the prize draw below.`
                : "You were eliminated, but you can still enter our consolation prize draw!"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className={`bg-input border-border text-foreground ${
                    errors.name ? "border-danger" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-danger text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  className={`bg-input border-border text-foreground ${
                    errors.email ? "border-danger" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-danger text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full game-button py-3 text-lg font-bold"
                disabled={isLoading}
              >
                {isLoading ? "Submitting…" : "Enter Prize Draw"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/collection")}
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                View The Full Collection Here
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              By submitting this form, you agree to our terms and conditions.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Form;
