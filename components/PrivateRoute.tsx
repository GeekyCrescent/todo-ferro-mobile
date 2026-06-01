import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { ReactNode, useEffect, useState } from "react";

import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { TOKEN_KEY } from "@/lib/api";

type Props = { children: ReactNode };

export default function PrivateRoute({ children }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then((t) => {
      setToken(t);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Spinner size="large" />
      </Box>
    );
  }

  if (!token) return <Redirect href="/login" />;

  return <>{children}</>;
}
