import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
     <div className="flex min-h-[90vh] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
