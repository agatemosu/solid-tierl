interface Props {
	ref: HTMLDivElement;
}

function ImagesBar(props: Props) {
	return <div class="images-bar row" ref={props.ref} />;
}

export default ImagesBar;
