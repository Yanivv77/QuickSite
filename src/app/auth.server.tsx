import { getUser } from "@/lib/queries";
import { LoginForm, SignInSignUp, SignOut } from "./auth.client";

export async function AuthServer() {
  const user = await getUser();
  if (!user) {
    return <SignInSignUp />;
  }
  return <SignOut username={user.username} />;
}

export async function PlaceOrderAuth() {
  const user = await getUser();
  if (user) {
    return null;
  }
  return (
    <>

        <LoginForm />

    </>
  );
}
