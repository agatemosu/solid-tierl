interface Props {
	image: HTMLImageElement;
}

function TierItem({ image }: Props) {
	return (
		<div
			class="tier-item"
			style={{
				"aspect-ratio": `${image.width} / ${image.height}`,
				"background-image": `url("${image.src}")`,
				"min-height": `${Math.min(image.height, 80)}px`,
			}}
		/>
	);
}

export default TierItem;
