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
import { clearColor, defaultColors, defaultRows } from "~/constants";
import "~/styles/app.css";

function getDefaultRows() {
	const rows = [];

	for (let i = 0; i < defaultRows.length; i++) {
		const color = defaultColors[i];
		const name = defaultRows[i];

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
		const tooltip = menuClicked.querySelector<HTMLDivElement>(".js-tooltip");

		for (const menu of visibleMenus) {
			if (menu !== tooltip) {
				menu.dataset.visibility = "hidden";
			}
		}

		if (!tooltip) {
			return;
		}

		tooltip.dataset.visibility = "visible";
		return;
	}

	for (const menu of visibleMenus) {
		menu.dataset.visibility = "hidden";
	}
}

function App() {
	let blackoutRef!: HTMLDivElement;
	let rowsRef!: HTMLDivElement;
	let imagesBarRef!: HTMLDivElement;
	let exportRef!: HTMLDivElement;

	const [rows, setRows] = createSignal(getDefaultRows());
	const [src, setSrc] = createSignal("");

	const addRow = () => {
		setRows([...rows(), { name: "New tier", color: clearColor }]);
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
				const MAX_HEIGHT = 200;

				if (image.height <= MAX_HEIGHT) {
					render(() => <TierItem image={image} />, imagesBarRef);
					return;
				}

				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				const scaleSize = MAX_HEIGHT / image.height;
				canvas.width = image.width * scaleSize;
				canvas.height = MAX_HEIGHT;

				ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
				image.src = canvas.toDataURL();
			};
		}
	};

	const createImage = async () => {
		const canvas = await html2canvas(rowsRef, {
			scale: 1.5,
			windowWidth: 1080,
		});
		setSrc(canvas.toDataURL());

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
			<Export ref={exportRef} src={src} />
		</>
	);
}

export default App;
