import type { Accessor } from "solid-js";
import { t } from "~/i18n";

interface Props {
	ref: HTMLDivElement;
	src: Accessor<string>;
}

function ExportImage(props: Props) {
	const saveImage = () => {
		const downloadLink = document.createElement("a");
		downloadLink.href = props.src();
		downloadLink.download = "image.png";

		downloadLink.click();
	};

	return (
		<div class="export" data-visibility="hidden" ref={props.ref}>
			<div class="export__image-container">
				<img class="export__image" alt="Exported tier list" src={props.src()} />
			</div>

			<div class="export__button-container">
				<button
					type="button"
					class="btn-big export__button"
					onClick={saveImage}
				>
					{t("save_image")}
				</button>
			</div>
		</div>
	);
}

export default ExportImage;
