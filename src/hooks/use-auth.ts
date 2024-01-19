import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Custom hook for authentication-related functionality
export const useAuth = () => {
  // Access the Next.js router
  const router = useRouter();

  // Function for signing out the user
  const signOut = async () => {
    try {
      // Make a POST request to the server's /api/users/logout endpoint
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {
          method: "POST",
          credentials: "include", // Include credentials in the request
          headers: {
            "Content-Type": "application/json", // Specify content type as JSON
          },
        }
      );

      // Check if the request was successful
      if (!res.ok) throw new Error();

      // Display a success toast message
      toast.success("Sign out successfully");

      // Redirect the user to the sign-in page
      router.push("/sign-in");

      // Refresh the current page
      router.refresh();
    } catch (error) {
      // Display an error toast message if signing out fails
      toast.error("Couldn't sign out, please try again");
    }
  };

  // Return the signOut function as part of the custom hook's API
  return { signOut };
};
