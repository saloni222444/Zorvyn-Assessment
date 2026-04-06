import SignInForm from "./_component/signin-form";
import Logo from "@/components/logo/logo";

const SignIn = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md mx-4">
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <Logo url="/" />
          </div>
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default SignIn;