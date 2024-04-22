var setting_winning_score_default = 500;
var setting_board_color_default = 'wood';
var setting_card_color_default = 'blue';

function GetSetting(setting) {
	switch (setting) {
		case "setting_winning_score":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_winning_score_default : settingVal;
			break;
		case "setting_board_color":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_board_color_default : settingVal;
			break;
		case "setting_card_color":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_card_color_default : settingVal;
			break;
	}
}

function SetSetting(setting, val) {
	window.localStorage.setItem(setting, val);
}

function GetStatistic(statistic) {
    var val = window.localStorage.getItem(statistic);
    return val == null ? Number(0) : Number(val);
}

function GetStatisticString(statistic) {
	var val = window.localStorage.getItem(statistic);
	return val == null ? "" : val;
}

function SetStatistic(statistic, value) {
	window.localStorage.setItem(statistic, value);
}