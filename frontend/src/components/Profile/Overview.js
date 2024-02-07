import Component from "../../core/Component.js";
import appendCSSLink from "../../utils/appendCSSLink.js";

appendCSSLink("src/components/Profile/Overview.css");

export default class Overview extends Component {
  template() {
    const { wins, losses } = this.props;

    return `
		<div
			class="d-flex flex-column align-items-center"
		>
			<h3
				class="text-white"
				style="font-weight: bold;"
			>
				Overview
			</h3>
			<div class="record">Win 
				<span
					class="record-value">
					${wins}
				</span>
			</div>
			<div class="record">Lost 
				<span
					class="record-value">
					${losses}
				</span>
			</div>
			<div class="record">Win Rate 
				<span
					class="record-value" style="margin-left: 1rem;">
					${(wins / (wins + losses)) * 100}%
				</span>
			</div>
		</div>
    `;
  }
}
