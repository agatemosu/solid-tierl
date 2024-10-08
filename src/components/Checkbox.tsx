interface Props {
	label: string;
	onChange: (e: Event) => void;
	id: string;
}

function Checkbox(props: Props) {
	return (
		<label class="checkbox">
			<span>
				<input
					type="checkbox"
					class="checkbox__input"
					onChange={props.onChange}
					id={props.id}
				/>
				<span class="checkbox__label">{props.label}</span>
			</span>
		</label>
	);
}

export default Checkbox;
