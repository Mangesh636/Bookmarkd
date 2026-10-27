import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { toast } from "@/shared/components/ui/toast";
import { auth } from "../auth";
import { getAuthErrorMessage, isDuplicateAccountError } from "../auth-errors";
import { SignUpSchema } from "../schema";
import { AuthWrapper } from "./auth-wrapper";

export const SignUpForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    void auth
      .getSession()
      .then(() => {
        if (active) void navigate({ to: "/dashboard", replace: true });
      })
      .catch(() => {
        // A missing session is expected on the sign-up page.
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validators: { onSubmit: SignUpSchema },
    onSubmit: async ({ value }) => {
      const name = `${value.firstName.trim()} ${value.lastName.trim()}`;

      try {
        await auth.signUp(name, value.email, value.password);
      } catch (error) {
        if (isDuplicateAccountError(error)) {
          toast.add({
            type: "info",
            description: "An account with this email already exists. Please sign in.",
          });
          await navigate({ to: "/auth/sign-in", replace: true });
          return;
        }

        toast.add({
          type: "error",
          description: getAuthErrorMessage(error),
        });
        return;
      }

      try {
        // Appwrite account creation does not create a session.
        await auth.signIn(value.email, value.password);
        toast.add({
          type: "success",
          description: "Account created successfully.",
        });
        await navigate({ to: "/dashboard", replace: true });
      } catch (error) {
        // The account may exist even if session creation failed.
        toast.add({
          type: "error",
          description: `Your account was created, but we couldn't sign you in. Please sign in with your new credentials. ${getAuthErrorMessage(error)}`,
        });
        await navigate({ to: "/auth/sign-in", replace: true });
      }
    },
  });

  return (
    <AuthWrapper
      mode="sign-up"
      brandingTitle="Your Next Favorite"
      brandingDescription="Save it now. Find it anytime."
      title="Create your account"
      description="Start saving and organizing what matters to you."
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      showOAuth={true}
      footer={
        <>
          Already have an account?{" "}
          <a
            href="/auth/sign-in"
            className="underline-offset-4 hover:underline"
          >
            Sign in
          </a>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <form.Field name="firstName">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid} className="-space-y-2">
                <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="john"
                  autoComplete="given-name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  className="border-2 border-accent bg-background py-4"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="lastName">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid} className="-space-y-2">
                <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="doe"
                  autoComplete="family-name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  className="border-2 border-accent bg-background py-4"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </div>

      <form.Field name="email">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid} className="-space-y-2">
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isInvalid}
                className="border-2 border-accent bg-background py-4"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="password">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid} className="-space-y-2">
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isInvalid}
                className="border-2 border-accent bg-background py-4"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <Field>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          )}
        </form.Subscribe>
      </Field>
    </AuthWrapper>
  );
};
