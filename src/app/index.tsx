import { Redirect } from "expo-router";

export default function Index() {
  // This route will be handled by _layout.tsx routing
  return <Redirect href={"/auth/login" as any} />;
}
