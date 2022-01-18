function renderTip(template, context) {
	var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;
	return template.replace(tokenReg, function (word, slash1, token, slash2) {
		if (slash1 || slash2) {
			return word.replace("\\", "");
		}
		var variables = token.replace(/\s/g, "").split(".");
		var currentObject = context;
		var i, length, variable;
		for (i = 0, length = variables.length; i < length; ++i) {
			variable = variables[i];
			currentObject = currentObject[variable];
			if (currentObject === undefined || currentObject === null) return "";
		}
		return currentObject;
	});
}

String.prototype.renderTip = function (context) {
	return renderTip(this, context);
};

(function () {
	var element = new Image();
	Object.defineProperty(element, "id", {
		get: function () {
			showMessage("咦？你打开控制台是想看本喵的秘密吗？", 5000);
		},
	});
	console.log(element);
})();

$(document).on("copy", function () {
	showMessage("你都复制了些什么呀，转载要记得加上出处哦~~", 5000);
});

function initTips() {
	$.ajax({
		cache: true,
		url: `/media/live2d/message.json`,
		dataType: "json",
		success: function (result) {
			$.each(result.mouseover, function (index, tips) {
				$(tips.selector).mouseover(function () {
					var text = tips.text;
					if (Array.isArray(tips.text))
						text = tips.text[Math.floor(Math.random() * tips.text.length + 1) - 1];
					text = text.renderTip({ text: $(this).text() });
					showMessage(text, 3000);
				});
			});
			$.each(result.click, function (index, tips) {
				$(tips.selector).click(function () {
					var text = tips.text;
					if (Array.isArray(tips.text))
						text = tips.text[Math.floor(Math.random() * tips.text.length + 1) - 1];
					text = text.renderTip({ text: $(this).text() });
					showMessage(text, 3000);
				});
			});
		},
	});
}
initTips();

(function () {
	var text;
	if (document.referrer !== "") {
		var referrer = document.createElement("a");
		referrer.href = document.referrer;
		text = '嗨！来自 <span style="color:#0099cc;">' + referrer.hostname + "</span> 的朋友！";
		var domain = referrer.hostname.split(".")[1];
		if (domain == "baidu") {
			text =
				'嗨！ 来自 百度搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' +
				document.title.split(" - ")[0] +
				" 」</span>";
		} else if (domain == "so") {
			text =
				'嗨！ 来自 360搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' +
				document.title.split(" - ")[0] +
				" 」</span>";
		} else if (domain == "google") {
			text =
				'嗨！ 来自 谷歌搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' +
				document.title.split(" - ")[0] +
				" 」</span>";
		}
	} else {
		if (window.location.href == `${home_Path}`) {
			//主页URL判断，需要斜杠结尾
			var now = new Date().getHours();
			if (now > 23 || now <= 5) {
				text = "我是夜猫子，难道你也是？这么晚还不睡，是来陪我看星星的嘛？忙完了记得早点睡呀，明早我来告诉你今夜星星的耳语~";
			} else if (now > 5 && now <= 7) {
				text = "早上好！初生的朝阳如你的笑容般宛然，美好的一天就要开始了！( •̀ ω •́ )y";
			} else if (now > 7 && now <= 11) {
				text = "上午好！今天精彩嘛，不要久坐，多起来走动走动哦！也许会遇上有趣的事哟！";
			} else if (now > 11 && now <= 13) {
				text = "中午了，美好的一天已经过了一半了，现在是午餐时间！唯吃饭和睡觉不可辜负~";
			} else if (now > 13 && now <= 17) {
				text = "午后很容易犯困呢，今天的目标完成了吗？还是要适时午睡哟~喵呜~我要睡了，午安——";
			} else if (now > 17 && now <= 19) {
				text = "傍晚了！窗外夕阳的景色很美丽呢，一如你的眼眸藏着整片世界~~";
			} else if (now > 19 && now <= 21) {
				text = "晚上好，今天过得怎么样？也是值得铭记的一天吧！";
			} else if (now > 21 && now <= 23) {
				text = "已经这么晚了呀，早点休息吧，晚安~~，好梦哟~~";
			} else {
				text = "嗨~ 快来逗我玩吧！";
			}
		} else {
			var documentTitle = document.title.split(" - ")[0];
			if (documentTitle === "搜索") {
				text = '搜索方式为<span style="color:#0099cc;">「 模糊搜索 」</span>哟';
			} else {
				text = '欢迎阅读<span style="color:#0099cc;">「 ' + documentTitle + " 」</span>";
			}
		}
	}
	showMessage(text, 12000);
})();

window.setInterval(showHitokoto, 30000);

function showHitokoto() {
	$.getJSON("https://v1.hitokoto.cn/", function (result) {
		showMessage(result.hitokoto, 5000);
	});
}

function showMessage(text, timeout) {
	if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1) - 1];
	//console.log('showMessage', text);
	$(".message").stop();
	$(".message").html(text).fadeTo(200, 1);
	if (timeout === null) timeout = 5000;
	hideMessage(timeout);
}

function hideMessage(timeout) {
	$(".message").stop().css("opacity", 1);
	if (timeout === null) timeout = 5000;
	$(".message").delay(timeout).fadeTo(200, 0);
}

function initLive2d() {
	$(".hide-button")
		.fadeOut(0)
		.on("click", () => {
			$("#landlord").css("display", "none");
		});
	$("#landlord").hover(
		() => {
			$(".hide-button").fadeIn(600);
		},
		() => {
			$(".hide-button").fadeOut(600);
		},
	);
}
initLive2d();
