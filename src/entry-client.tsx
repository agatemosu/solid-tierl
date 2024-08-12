// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

const app = document.getElementById("app") as HTMLDivElement;
mount(() => <StartClient />, app);
