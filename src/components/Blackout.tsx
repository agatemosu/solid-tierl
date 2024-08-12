interface Props {
	ref: HTMLDivElement;
}

function Blackout(props: Props) {
	return <div class="blackout" data-visibility="hidden" ref={props.ref} />;
}

export default Blackout;
