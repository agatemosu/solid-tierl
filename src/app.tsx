import "@simonwep/pickr/dist/themes/monolith.min.css";
import html2canvas from "html2canvas";
import { createSignal, onMount } from "solid-js";
import { render } from "solid-js/web";
import Sortable from "sortablejs";
import Blackout from "~/components/Blackout";
import Export from "~/components/Export";
import ImagesBar from "~/components/ImagesBar";
import ListOptions from "~/components/ListOptions";
import Rows from "~/components/Rows";
import TierItem from "~/components/TierItem";
import { maxHeight, pixelatedHeight, presets } from "~/constants";
import { t } from "~/i18n";
import "~/styles/app.css";

function getDefaultRows() {
	const rows = [];

	for (let i = 0; i < presets.rows.length; i++) {
		const color = presets.colors[i];
		const name = presets.rows[i];

		rows[i] = { name, color };
	}

	return rows;
}

function onMouseDown(e: MouseEvent) {
	const ignoreSelectors = [".pcr-app", ".export"];
	const target = e.target as HTMLElement;

	const ignoreClick = ignoreSelectors.some((selector) =>
		target.closest(selector),
	);

	if (ignoreClick) {
		return;
	}

	const menuClicked = target.closest(".js-label");
	const visibleMenus = document.querySelectorAll<HTMLDivElement>(
		'[data-visibility="visible"]',
	);

	if (menuClicked) {
		const tooltip = menuClicked.querySelector(".js-tooltip") as HTMLDivElement;

		for (const menu of visibleMenus) {
			menu.dataset.visibility = "hidden";
		}

		tooltip.dataset.visibility = "visible";
		return;
	}

	for (const menu of visibleMenus) {
		menu.dataset.visibility = "hidden";
	}
}

function compressImage(image: HTMLImageElement) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		return "";
	}

	const scaleSize = maxHeight / image.height;
	canvas.width = image.width * scaleSize;
	canvas.height = maxHeight;

	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

	return canvas.toDataURL();
}

function scaleImage(image: HTMLImageElement) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		return "";
	}

	const scaleSize = pixelatedHeight / image.height;
	canvas.width = image.width * scaleSize;
	canvas.height = pixelatedHeight;

	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

	return canvas.toDataURL();
}

function App() {
	let blackoutRef!: HTMLDivElement;
	let rowsRef!: HTMLDivElement;
	let imagesBarRef!: HTMLDivElement;
	let exportRef!: HTMLDivElement;

	const [rows, setRows] = createSignal(getDefaultRows());
	const [exportedImgSrc, setExportedImgSrc] = createSignal("");

	const addRow = () => {
		setRows([...rows(), { name: t("newTier"), color: presets.color }]);
	};

	const uploadImages = (files?: FileList | null) => {
		if (!files) {
			return;
		}

		for (const file of files) {
			if (file.type.split("/")[0] !== "image") {
				continue;
			}

			const image = new Image();
			image.src = URL.createObjectURL(file);

			image.onload = () => {
				const newImage = new Image();

				switch (true) {
					case image.height > maxHeight: {
						const img = compressImage(image);
						newImage.src = img;
						break;
					}

					case image.height <= pixelatedHeight: {
						const img = scaleImage(image);
						newImage.src = img;
						break;
					}

					default: {
						newImage.src = image.src;
						break;
					}
				}

				newImage.onload = () => {
					render(() => <TierItem image={newImage} />, imagesBarRef);
				};
			};
		}
	};

	const createImage = async () => {
		const canvas = await html2canvas(rowsRef, {
			scale: 1.5,
			windowWidth: 1080,
		});
		setExportedImgSrc(canvas.toDataURL());

		exportRef.dataset.visibility = "visible";
		blackoutRef.dataset.visibility = "visible";
	};

	onMount(() => {
		document.addEventListener("drop", (e) => {
			e.preventDefault();
			uploadImages(e.dataTransfer?.files);
		});

		document.addEventListener("dragover", (e) => {
			e.preventDefault();
		});

		document.addEventListener("mousedown", onMouseDown);

		Sortable.create(imagesBarRef, { group: "tiers" });
	});

	return (
		<>
			<Blackout ref={blackoutRef} />
			<Rows rows={rows} setRows={setRows} ref={rowsRef} />
			<ListOptions
				addRow={addRow}
				uploadImages={uploadImages}
				createImage={createImage}
			/>
			<ImagesBar ref={imagesBarRef} />
			<Export ref={exportRef} src={exportedImgSrc} />
		</>
	);
}

export default App;
