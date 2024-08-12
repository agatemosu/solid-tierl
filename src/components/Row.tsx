import Pickr from "@simonwep/pickr";
import { createSignal, onCleanup, onMount } from "solid-js";
import Sortable from "sortablejs";
import { ChevronDown, ChevronUp, Trash } from "~/components/Icons";
import { clearColor, defaultColors } from "~/constants";

interface Props {
	index: number;
	tier: { name: string; color: string };
	moveUp: (index: number) => void;
	moveDown: (index: number) => void;
	deleteRow: (index: number) => void;
	renameRow: (index: number, newName: string) => void;
	changeColor: (index: number, newColor: string) => void;
}

function Row(props: Props) {
	let sortRef!: HTMLDivElement;
	let pickrRef!: HTMLDivElement;
	let dragInstance: Sortable;
	let pickrInstance: Pickr;

	const [newName, setNewName] = createSignal(props.tier.name);
	const [color, setColor] = createSignal(props.tier.color);
	const [textColor, setTextColor] = createSignal("black");

	const handleRename = () => {
		if (props.tier.name === newName()) {
			return;
		}

		props.renameRow(props.index, newName());
	};

	onMount(() => {
		dragInstance = new Sortable(sortRef, { group: "tiers" });
		pickrInstance = new Pickr({
			el: pickrRef,
			container: "#app",
			theme: "monolith",
			default: color(),
			swatches: defaultColors,
			components: {
				preview: true,
				hue: true,
				interaction: {
					input: true,
					clear: true,
					save: true,
				},
			},
		});

		pickrInstance.on("save", (hsvaColor: Pickr.HSVaColor) => {
			if (hsvaColor === null) {
				pickrInstance.setColor(clearColor);
				return;
			}

			const hsl = hsvaColor.toHSLA();
			const lightness = hsl[2];

			setColor(hsvaColor.toHEXA().toString());
			setTextColor(lightness < 50 ? "white" : "black");

			props.changeColor(props.index, color());
			pickrInstance.hide();
		});
	});

	onCleanup(() => {
		dragInstance.destroy();
		pickrInstance.destroyAndRemove();
	});

	return (
		<div class="tier">
			<div
				class="tier-label js-label"
				style={{ "--tier-bg": color(), "--tier-color": textColor() }}
			>
				<div
					class="tier-label__text"
					contentEditable={true}
					spellcheck={false}
					onBlur={handleRename}
					onInput={(e) => setNewName(e.currentTarget.innerText)}
				>
					<span class="tier-label__text--content">{props.tier.name}</span>
				</div>
				<div class="tier-label__tooltip js-tooltip" data-visibility="hidden">
					<div ref={pickrRef} />
				</div>
			</div>
			<div class="tier--content row" ref={sortRef} />
			<div class="tier-options__container" data-html2canvas-ignore>
				<div class="tier-options">
					<div class="tier-option tier-option--delete">
						<div
							class="tier-option__container"
							onClick={() => props.deleteRow(props.index)}
						>
							<Trash />
						</div>
					</div>
					<div class="tier-option">
						<div
							class="tier-option__container"
							onClick={() => props.moveUp(props.index)}
						>
							<ChevronUp />
						</div>
					</div>
					<div class="tier-option">
						<div
							class="tier-option__container"
							onClick={() => props.moveDown(props.index)}
						>
							<ChevronDown />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Row;
