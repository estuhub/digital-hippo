import VerifyEmail from "@/components/VerifyEmail";
import Image from "next/image";

interface VerifyEmailPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const VerifyEmailPage = ({ searchParams }: VerifyEmailPageProps) => {
  const token = searchParams.token;
  const toEmail = searchParams.to;

  return (
    <div className="container relative flex p-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {token && typeof token === "string" ? (
          // If token exists and is a string, it assumes that the email is verified and renders the VerifyEmail component.
          <div className="grid gap-6">
            <VerifyEmail token={token} />
          </div>
        ) : (
          // If token is not a string or does not exist, it assumes that the email is not verified
          // and renders a message with an image indicating that a verification link has been sent to the email.
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div className="relative mb-4 h-60 w-60 text-muted-foreground">
              <Image
                src="/hippo-email-sent.png"
                fill
                alt="hippo email sent image"
              />
            </div>
            <h3 className="font-semibold text-2xl">Check your email</h3>
            {toEmail ? (
              <p className="text-muted-foreground text-center">
                We&apos;ve sent a verification link to{" "}
                <span className="font-semibold">{toEmail}</span>.
              </p>
            ) : (
              <p className="text-muted-foreground text-center">
                We&apos;ve sent a verification link to your email.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
