import type { Accessor, Setter } from "solid-js";
import { For } from "solid-js";
import Row from "~/components/Row";

interface Props {
	rows: Accessor<{ name: string; color: string }[]>;
	setRows: Setter<{ name: string; color: string }[]>;
	ref: HTMLDivElement;
}

function Rows(props: Props) {
	const moveRowUp = (index: number) => {
		if (index === 0) {
			return;
		}

		const updatedRows = [...props.rows()];
		[updatedRows[index - 1], updatedRows[index]] = [
			updatedRows[index],
			updatedRows[index - 1],
		];

		props.setRows(updatedRows);
	};

	const moveRowDown = (index: number) => {
		if (index === props.rows().length - 1) {
			return;
		}

		const updatedRows = [...props.rows()];
		[updatedRows[index + 1], updatedRows[index]] = [
			updatedRows[index],
			updatedRows[index + 1],
		];

		props.setRows(updatedRows);
	};

	const deleteRow = (index: number) => {
		const updatedRows = props.rows().filter((_, i) => i !== index);
		props.setRows(updatedRows);
	};

	const renameRow = (index: number, newName: string) => {
		const updatedRows = [...props.rows()];
		updatedRows[index].name = newName;
		props.setRows(updatedRows);
	};

	const changeColor = (index: number, newColor: string) => {
		const updatedRows = [...props.rows()];
		updatedRows[index].color = newColor;
		props.setRows(updatedRows);
	};

	return (
		<main ref={props.ref}>
			<For each={props.rows()}>
				{(tier, index) => (
					<Row
						index={index()}
						tier={tier}
						moveUp={moveRowUp}
						moveDown={moveRowDown}
						deleteRow={deleteRow}
						renameRow={renameRow}
						changeColor={changeColor}
					/>
				)}
			</For>
		</main>
	);
}

export default Rows;
