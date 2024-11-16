"use client";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ActionState } from "@/lib/middleware";
import { signIn, signUp } from "./(auth)/actions";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LoginForm() {
  const [signInState, signInFormAction, signInPending] = useActionState<
    ActionState,
    FormData
  >(signIn, { error: "" });
  const [signUpState, signUpFormAction, signUpPending] = useActionState<
    ActionState,
    FormData
  >(signUp, { error: "" });
  const pending = signInPending || signUpPending;
  const state = signInState.error ? signInState : signUpState;

  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="signin" aria-label="Switch to sign in form">Sign In</TabsTrigger>
        <TabsTrigger value="signup" aria-label="Switch to sign up form">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="signin">
        <form className="flex flex-col space-y-6">
          <div className="flex flex-col gap-4">
            <div className="mt-1">
              <Input
                id="username"
                name="username"
                aria-label="Username"
                type="text"
                autoCapitalize="off"
                autoComplete="username"
                spellCheck={false}
                required
                maxLength={50}
                className="relative block w-full appearance-none rounded-[1px] border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                placeholder="Username"
              />
            </div>

            <div>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  aria-label="Password"
                  type="password"
                  required
                  maxLength={100}
                  className="relative block w-full appearance-none rounded-[1px] border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="rounded-[1px] bg-accent1 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-accent1 focus:outline-none focus:ring-2 focus:ring-accent1 focus:ring-offset-2"
              disabled={pending}
              formAction={signInFormAction}
              aria-label="Sign in to your account"
            >
              {"Sign In"}
            </Button>
          </div>
          {signInState?.error && (
            <div className="text-sm text-red-500">{signInState.error}</div>
          )}
        </form>
      </TabsContent>

      <TabsContent value="signup">
        <form className="flex flex-col space-y-6">
          <div className="flex flex-col gap-4">
            <div className="mt-1">
              <Input
                id="username"
                name="username"
                aria-label="Username"
                type="text"
                autoCapitalize="off"
                autoComplete="username"
                spellCheck={false}
                required
                maxLength={50}
                className="relative block w-full appearance-none rounded-[1px] border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                placeholder="Username"
              />
            </div>

            <div>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  aria-label="Password"
                  type="password"
                  required
                  maxLength={100}
                  className="relative block w-full appearance-none rounded-[1px] border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="rounded-[1px] bg-accent1 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-accent1 focus:outline-none focus:ring-2 focus:ring-accent1 focus:ring-offset-2"
              disabled={pending}
              formAction={signUpFormAction}
              aria-label="Create new account"
            >
              {"Sign Up"}
            </Button>
          </div>
          {signUpState?.error && (
            <div className="text-sm text-red-500">{signUpState.error}</div>
          )}
        </form>
      </TabsContent>
    </Tabs>
  );
}

export function SignInSignUp() {
  return (
    <Popover>
      <PopoverTrigger 
        className="flex flex-row items-center gap-1"
        aria-label="Open sign in menu"
      >
      <svg viewBox="0 0 10 6" className="h-[6px] w-[10px]">
          <polygon points="0,0 5,6 10,0"></polygon>
        </svg>
        Sign In{" "}
        
      </PopoverTrigger>
      <PopoverContent className="px-8 py-4">
        <LoginForm />
      </PopoverContent>
    </Popover>
  );
}

import { signOut } from "./(auth)/actions";

export function SignOut(props: { username: string }) {
  return (
    <Popover>
      <PopoverTrigger className="flex flex-row items-center gap-2" aria-label="Open user menu">
      <svg viewBox="0 0 10 6" className="h-[6px] w-[10px]">
          <polygon points="0,0 5,6 10,0"></polygon>
        </svg>
        {props.username}{" "}
       
      </PopoverTrigger>
      <PopoverContent className="flex w-32 flex-col items-center px-8 py-4">
        <form>
          <Button
            formAction={signOut}
            variant={"ghost"}
            className="rounded-[2px] border-[1px] border-accent1 bg-white px-4 py-2 text-xs font-semibold text-accent1"
            aria-label="Sign out of your account"
          >
            {"Sign Out"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
