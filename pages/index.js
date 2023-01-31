import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (!!sessionStorage.jwt) {
      const customerHref = JSON.parse(sessionStorage.customer).href;
      const organization = customerHref.split("/")[4];

      router.push("/" + organization);
    } else {
      router.push("/login");
    }
  }, [router]);

  return <></>;
}
