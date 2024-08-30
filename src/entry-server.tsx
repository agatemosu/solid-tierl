// @refresh reload
import { StartServer, createHandler } from "@solidjs/start/server";
import i18n from "~/i18n";

export default createHandler(({ request }) => {
	const acceptLanguage = request.headers.get("accept-language");
	i18n.setLanguage(acceptLanguage);

	return (
		<StartServer
			document={({ assets, children, scripts }) => (
				<html lang={i18n.locale}>
					<head>
						<meta charset="utf-8" />
						<meta
							name="viewport"
							content="width=device-width, initial-scale=1"
						/>
						<title>Tier list creator</title>
						<link rel="icon" href="/icon.svg" />
						{assets}
					</head>
					<body>
						<div id="app">{children}</div>
						{scripts}
					</body>
				</html>
			)}
		/>
	);
});
