import React from "react";
import AppStore from "../stores/AppStore";
import AppActions from "../actions/AppActions";
import Tooltips from "./Tooltips";

class AppRow extends React.Component {

    // CONSTRUCTOR
    constructor(props) {
        super(props);
        this.state = AppStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    // REMOVE APP
    removeApp() {
        this.props.removeApp(this.props.app);
    }

    // COMPONENT DID MOUNT
	componentDidMount() {
		AppStore.listen(this.onChange);

        // get index
        AppActions.getIndex(this.props.app.id);

		// tooltips
		window.setTimeout(() => {

			$(".influence-cell").tooltipster({
	            "position": "top",
	            "content": "This factor has the most influence on the privacy risk index"
	        });

			$(".tooltip").tooltipster({
	            "position": "top"
	        });

		}, 1000);
	}

	// COMPONENT WILL UNMOUNT
	componentWillUnmount() {
		AppStore.unlisten(this.onChange);
	}

	// ON CHANGE
	onChange(state) {
		this.setState(state);
	}

	// MAP ARCHETYPE
	mapArchetype(type) {
		switch(type) {
			case 1: return "Casual Tool";
			case 2: return "Common Knowledge Provider";
			case 3: return "Treatment Guide";
			case 4: return "Fitness Ad-Hoc Tool";
			case 5: return "Fitness Tracker";
			case 6: return "Treatment Support Tool";
			case 7: return "Intimate Ad-Hoc Tool";
			case 8: return "State of Health Test";
			case 9: return "Intimate Tracker";
			case 10: return "Health Monitor";
			case 11: return "Treatment Reminder";
			case 12: return "Health Record";
			default: return "none";
		}
	}

	// ESCAPE HTML
	escapeHtml(unsafe) {
		return unsafe
	         .replace(/&/g, "&amp;")
	         .replace(/</g, "&lt;")
	         .replace(/>/g, "&gt;")
	         .replace(/"/g, "&quot;")
	         .replace(/'/g, "&#039;");
	}

    // RENDER
    render() {

        var secure_transmission = "no data connection", data_reasonable = "-";
        if(this.props.app.personal_target.length > 0) {
            secure_transmission = (this.props.app.secure_transmission === true) ? <i className="fa fa-check fa-lg"></i> : <i className="fa fa-times fa-lg"></i>;
        }

        data_reasonable = (this.props.app.data_reasonable === true) ? <i className="fa fa-check fa-lg"></i> : <i className="fa fa-times fa-lg"></i>;

        var store_url, store_name, store_icon;
        if(this.props.app.rater === "thomas") {
            store_name = "Apple AppStore";
            store_url = "https://itunes.apple.com/app/store/id" + this.props.app.store_id;
            store_icon = <i className="fa fa-apple fa-fw"></i>;
        }
        else {
            store_name = "Google PlayStore";
            store_url = "https://play.google.com/store/apps/details?id=" + this.props.app.package_name;
            store_icon = <i className="fa fa-android fa-fw"></i>;
        }

		if(!this.state.idx[this.props.app.id]) return null;

        // fetch index
        this.props.app.privacy_index = this.state.idx[this.props.app.id].idx;

        // determine idx color
        var idx_class = "idx";
        if(this.props.app.privacy_index <= 15) {
            idx_class += " idx_green";
        }
        else if(this.props.app.privacy_index > 15 && this.props.app.privacy_index <= 50) {
            idx_class += " idx_orange";
        }
        else {
            idx_class += " idx_red";
        }

        var categoryCellClass = "app-cell";
        var categoryCellInfluence = null;
        if(this.props.app.influence_key === "category") {
            categoryCellClass += " influence-cell";
            categoryCellInfluence = <i className="fa fa-bolt fa-influence"></i>;
        }

        var personalTargetCellClass = "app-cell";
        var personalTargetCellInfluence = null;
        if(this.props.app.influence_key === "personal_target") {
            personalTargetCellClass += " influence-cell";
            personalTargetCellInfluence = <i className="fa fa-bolt fa-influence"></i>;
        }

        var unspecificTargetCellClass = "app-cell";
        var unspecificTargetCellInfluence = null;
        if(this.props.app.influence_key === "category") {
            unspecificTargetCellClass += " influence-cell";
            unspecificTargetCellInfluence = <i className="fa fa-bolt fa-influence"></i>;
        }

        var dataReasonableCellClass = "app-cell";
        var dataReasonableCellInfluence = null;
        if(this.props.app.influence_key === "category") {
            dataReasonableCellClass += " influence-cell";
            dataReasonableCellInfluence = <i className="fa fa-bolt fa-influence"></i>;
        }

        var secureCellClass = "app-cell";
        var secureCellInfluence = null;
        if(this.props.app.influence_key === "category") {
            secureCellClass += " influence-cell";
            secureCellInfluence = <i className="fa fa-bolt fa-influence"></i>;
        }

		var min = null;
		var line = null;
		if(this.state.idx[this.props.app.id].continuum.min !== null) {
			min = <span className="idx_min">{this.state.idx[this.props.app.id].continuum.min}</span>;
			line = <span className="idx_line">&nbsp;</span>;
		}

		var max = null;
		if(this.state.idx[this.props.app.id].continuum.max !== null) {
			max = <span className="idx_max">{this.state.idx[this.props.app.id].continuum.max}</span>;
			line = <span className="idx_line">&nbsp;</span>;
		}

		console.log(Tooltips.confidence);

        return (<div className="app" id={"app" + this.props.app.id}>
            <div className="app-cell text-bold" dangerouslySetInnerHTML={{__html: this.props.app.name}}></div>
            <div className="app-cell">{store_icon}<a href={store_url} target="_blank">{store_name}</a></div>
			<div className="app-cell">{this.mapArchetype(this.props.app.archetype)}</div>
            <div className="app-cell">
				{line}
				{min}
				<span className={idx_class}>{this.props.app.privacy_index}</span>
				{max}
			</div>
            <div className="app-cell tooltip" title={Tooltips.confidence}>{parseInt(this.props.app.privacy_index_confidence * 100)}%</div>
            <div className={categoryCellClass} data-weight="category">{categoryCellInfluence}{(this.props.app.personal_category.length > 0) ? this.props.app.personal_category.join(", ") : "none"}</div>
            <div className="app-cell">
                {(this.props.app.login === true) ? <i className="fa fa-check fa-lg"></i> : <i className="fa fa-times fa-lg"></i>}
            </div>
            <div className={personalTargetCellClass} data-weight="personal_target">{personalTargetCellInfluence}{(this.props.app.personal_target.length > 0) ? this.props.app.personal_target.join(", ") : "nowhere"}</div>
            <div className={unspecificTargetCellClass} data-weight="unspecific_target">{unspecificTargetCellInfluence}{(this.props.app.unspecific_target.length > 0) ? this.props.app.unspecific_target.join(", ") : "no"}</div>
            <div className={dataReasonableCellClass} data-weight="data_reasonable">{dataReasonableCellInfluence}{data_reasonable}</div>
            <div className={secureCellClass} data-weight="secure">{secureCellInfluence}{secure_transmission}</div>
            <div className="app-cell"><a href="#" onClick={this.removeApp.bind(this)}>remove</a></div>
        </div>);
    }
}

export default AppRow;
