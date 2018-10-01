import { h, Component } from "preact";

export interface ToolbarProps {}
export interface ToolbarState {
	open: boolean;
}

export interface ToolbarItemProps {
	action: Function;
	label: string;
}
export interface ToolbarItemState {}

import "./style.sss";

export class ToolbarItem extends Component<ToolbarItemProps, ToolbarItemState> {
	render({ action, label }: { action: Function; label: string }) {
		return <li onClick={event => action(event)}>{label}</li>;
	}
}

export class Toolbar extends Component<ToolbarProps, ToolbarState> {
	state = {
		open: false
	};

	toggle = (e: Event) => {
		this.setState({ open: !this.state.open });
		e.preventDefault();
	};

	render({ children }: { children: [] }) {
		let classes: string[] = ["toolbar"];
		if (this.state.open) classes.push("open");
		return (
			<div className={classes.join(" ")}>
				<div className="toggle" onClick={this.toggle} />
				<ul>{children}</ul>
				<div className="toggle" onClick={this.toggle} />
			</div>
		);
	}
}
