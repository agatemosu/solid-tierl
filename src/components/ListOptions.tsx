import Checkbox from "~/components/Checkbox";

interface Props {
	addRow: () => void;
	uploadImages: (files: FileList | null) => void;
	createImage: () => Promise<void>;
}

function ListOptions(props: Props) {
	const dynamicStyle = (e: Event) => {
		const target = e.target as HTMLInputElement;
		document.body.classList.toggle(target.id, target.checked);
	};

	return (
		<div class="list-options">
			<div class="list-options__container">
				<button type="button" class="btn-big" onClick={props.addRow}>
					New tier
				</button>

				<label class="btn-big">
					<span>Select images</span>
					<input
						type="file"
						accept="image/*"
						multiple={true}
						hidden={true}
						onChange={(e) => props.uploadImages(e.target.files)}
					/>
				</label>

				<Checkbox
					label="Square images"
					onChange={dynamicStyle}
					id="js-square-img"
				/>

				<button type="button" class="btn-big" onClick={props.createImage}>
					Export image
				</button>
			</div>
		</div>
	);
}

export default ListOptions;
