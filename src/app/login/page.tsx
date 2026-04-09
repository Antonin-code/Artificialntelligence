import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-[90vh] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
