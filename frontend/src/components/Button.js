import Component from "../core/Component.js";

export default class Button extends Component {
  template() {
    return `
  	<style>
      .valid {
        background-color: #FFB800;
        border: none;
        border-radius: 2rem;
        color: white;
        padding: 1rem 3rem;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-weight: bold;
        line-height: 1.5rem;
        font-size: 1.5rem;
        margin: 0.25rem 0.125rem;
        cursor: pointer;
      }
      .valid:hover {
        background-color: #BE8900;
        color: white;
      }
      
	  </style>

	<a href="" class="valid">Sign Up</a>
  `;
  }
}
