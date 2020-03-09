(function() {
	// 我们将所有的语句放入IIFE, 可以有效地防止变量互相污染
	// 获取元素
	var $carousel = $("#carousel");
	var $circles = $("#circles ol li");
	var $imgs = $("#imgs ul li");
	var $maoni = $("<li calss='maoni'></li>").appendTo($("#imgs ul"));
	// width: 138.33;  height: 143.66;


	// 点击蒙版中的叉号的是时候， 让对应蒙版消失
	$(".close").click(function() {
		$(this).parent().fadeOut(1000);
	})


	// 当页面刷新的时候， 让第一个蒙版淡入
	$(".mask").eq(0).fadeOut(0).fadeIn(1000);



	// 定义一个数组， 用于存放18张碎图片， 以图片1为例
	var arr = (function() {
		var temp = [];
		// 将图片分成3 * 6的格式
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 6; j++) {
				// 创建出来存入数组中
				temp.push($("<div></div>").css({
					"width": 0,
					"height": 0,
					"background": "url(images/slider-img1.jpg) no-repeat " + j * -138.33 + "px " + i * -143.66 + "px",
					"position": "absolute",
					"left": j * 138.33,
					"top": i * 143.66
				}).appendTo($maoni));
			}
		}
		// 返回数组
		return temp;
	})();

	// console.log(arr);


	// 定义两个信号量
	// 定义小圆点信号量
	var small_idx = 0;
	// 定义大图的信号量
	var big_idx = 0;

	// 定义锁
	var lock = true;


	// 开启定时器
	var timer = setInterval(function() {
		// 改变小圆点的信号量
		small_idx++;
		// 边界判断
		if (small_idx > $circles.length - 1) {
			small_idx = 0;
		}
		// console.log(small_idx);
		change.call($circles.eq(small_idx));
	}, 6000);


	// 当鼠标移入carousel的时候清除定时器
	$carousel.mouseenter(function() {
		// 清除定时器
		clearInterval(timer);
	})


	// 当鼠标离开carousel的时候重新开启定时器
	$carousel.mouseleave(function() {
		// 设表先关
		clearInterval(timer);
		// 重新赋值timer
		timer = setInterval(function() {
			// 改变小圆点的信号量
			small_idx++;
			// 边界判断
			if (small_idx > $circles.length - 1) {
				small_idx = 0;
			}
			// console.log(small_idx);
			change.call($circles.eq(small_idx));
		}, 6000);
	})

	// 小圆点点击事件
	$circles.click(change);

	// 定义函数，等价于右按钮点击事件
	function change() {
		// 函数节流
		if (!lock) {
			return;
		}
		// 关闭锁
		lock = false;

		// console.log($(this).index());
		// 改变小圆点的信号量
		small_idx = $(this).index();
		// console.log(small_idx);

		// 当小圆点的信号量与大图的信号相等的时候，什么也不做
		if (small_idx === big_idx) {
			// 开锁
			lock = true;
			// 什么也不做
			return;
		}

		// 当前小圆点要加cur
		$(this).addClass("cur").siblings().removeClass("cur");
		// 原来对应大图信号量的蒙版要消失
		$(".mask").eq(big_idx).fadeOut(1000);

		// 猫腻图要出现， 加active
		$maoni.addClass("active");

		// 轮换猫腻图
		// 使用$.each方法进行遍历
		$.each(arr, function(index, value) {
			// console.log(value);
			// 对应小圆点信号量的碎图要出现
			value.css("backgroundImage", "url(images/slider-img" + (small_idx + 1) + ".jpg)").animate({
				"width": 138.33,
				"height": 143.66
			}, 300 + Math.random() * 3000);
		})

		// 定义一个延时器，用于所有碎图出现完毕之后要做的事件
		setTimeout(function() {
			// 碎图动画完成之后，真图要出现
			// 使用$.each方法遍历arr中所有的div， 使所有的div宽高恢复为0
			$.each(arr, function(index, value) {
				// value 表示每一个div
				value.css({
					"width": 0,
					"height": 0
				})
			})

			// 对应小圆点的真图要出现
			// 改变大图的信号量
			big_idx = small_idx;

			// 对应大图信号量的图片要出现
			$imgs.eq(big_idx).addClass("active").siblings().removeClass("active");
			// 对应大图信号量的蒙版要淡入
			$(".mask").eq(big_idx).fadeOut(0).fadeIn(1000);


			// 所有事件完毕之后要开锁
			lock = true;

		}, 3300)
	}
})();