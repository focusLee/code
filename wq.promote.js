function set(result) {
    var promotHtml = {promotionsDiv:'',  // 促销 icon + 说明
        promotionsItemsArr:[],
        promoId:[],  //注意与下面的一对一关系
        promotionsItemsType10Arr:[],
        promotionsExtraDiv:'', //促销信息：  还没有找到例子
        giftsDiv:'',  // 赠　　品：
        tips:'',
        giftsItemsData:[]};  //温馨提示： 北京地区支持礼品包装  详情 >>
        
    if(!result) {
    	return promotHtml;
    }

    var promotionsItems = [],
        promotionsItemsExtra = [],
        promoType10 = [],
        giftsItems = [],	      
        tipsItems = [];	

    var infoList = result.promotionInfoList || [];
    var skuId = result.skuId;
    var str_len = 35;
    var gift_TPL = '{for item in adwordGiftSkuList}{if item.giftType==2}'
        + '<div class="li-img">'
        + '<a target="_blank" href="http://item.jd.com/${skuId}.html">{if item.imagePath !== ""}<img src="http://img13.360buyimg.com/n5/${item.imagePath}" width="25" height="25" />{else}<img src="http://misc.360buyimg.com/product/skin/2012/i/gift.png" width="25" height="25" />{/if}'
        + '{if item.name.length > ' + str_len + '}${item.name.substring(0,'+(str_len-1)+')+"..."}{else}${item.name}{/if}</a>'
        + '<em class="hl_red"> × ${item.number}</em>'
        + '</div>'
        + '{/if}{/for}';
    var gift_TPL_F = function(d){
    	var str = '', arr=d.adwordGiftSkuList;
    	for (var i=0; i < arr.length; i++) {
    		var item = arr[i];
    		str += '<li><a target="_blank" href="http://mm.wanggou.com/item/jd.shtml?sku='+skuId+'">';
    		str += item.imagePath ? '<img src="http://img13.360buyimg.com/n5/'+item.imagePath+'" class="photo"/>' : '<img src="http://misc.360buyimg.com/product/skin/2012/i/gift.png" class="photo"/>';
    		//str += item.name.length > str_len ? item.name.substring(0,'+(str_len-1)+')+"..." : item.name;
    		str += '<p class="fn">'+item.name+'</p>';
    		str += '<span class="sum">'+item.number+'件</span></a></li>';
    	}
    	!!str && (promotHtml.giftsItemsData = promotHtml.giftsItemsData.concat(arr));

    	return str;
    };
    
    if (infoList !== null && infoList.length > 0) {
        for (var i = 0; i < infoList.length; i++) {
            var levelText = getNewUserLevel(infoList[i].userLevel);
            var coupon = infoList[i].adwordCouponList;
            var limText = '';
            var buyNum = '';
            if (infoList[i].minNum > 0 || infoList[i].maxNum > 0) {
                if (infoList[i].minNum > 0 && infoList[i].maxNum == 0) {
                    limText = '购买至少' + infoList[i].minNum + '件时享受优惠';
                    buyNum = '购买' + infoList[i].minNum + '件及以上';
                } else if (infoList[i].minNum == 0 && infoList[i].maxNum > 0) {
                    limText = '购买最多' + infoList[i].maxNum + '件时享受优惠';
                    buyNum = '购买' + infoList[i].maxNum + '件及以下';
                } else if (infoList[i].minNum < infoList[i].maxNum) {
                    limText = '购买' + infoList[i].minNum + '-' + infoList[i].maxNum + '件时享受优惠';
                    buyNum = '购买' + infoList[i].minNum + '-' + infoList[i].maxNum + '件';
                } else if (infoList[i].minNum == infoList[i].maxNum) {
                    limText = '购买' + infoList[i].minNum + '件时享受优惠';
                    buyNum = '购买' + infoList[i].minNum + '件';
                }
            }
            // 会员特享
            var huiyuantexiang = infoList[i].userLevel > 50 && infoList[i].minNum == 0 && infoList[i].maxNum == 0 && infoList[i].needJBeanNum <= 0;
            // 会员特享 限购
            var huiyuantexiang_xianguo = infoList[i].userLevel > 50 && (infoList[i].minNum > 0 || infoList[i].maxNum > 0) && infoList[i].needJBeanNum <= 0;
            // 只有限购
            var xiangou = (infoList[i].minNum > 0 || infoList[i].maxNum > 0) && infoList[i].userLevel <= 50 && infoList[i].needJBeanNum <= 0;
            // 非会员非限购
            var normal = infoList[i].userLevel <= 50 && infoList[i].minNum == 0 && infoList[i].maxNum == 0 && infoList[i].needJBeanNum <= 0;
            //京豆优惠购
            var jBean = infoList[i].userLevel <= 50 && infoList[i].needJBeanNum > 0;
            // 获取券信息
            function setCoupon(coupon) {
                if (coupon != null && coupon.length > 0) {
                    $each(coupon, function (name, value) {
                        if (value.type == 1) {
                            var xianpinlei = value.key != null && value.key != "";
                            var xianpinleiTxt = xianpinlei ? '限品类' : '';
                            // 限品类券广告词
                            var xianpinleiguanggao = value.adWord != null && value.adWord.length > 0 ? '（' + value.adWord + ')' : '';
                            // 券会员特享
                            if (huiyuantexiang) {
                                promotionsItems.push('<em class="hl_red_bg">赠券</em><em class="hl_red">' + levelText + '及以上会员赠' + value.couponQouta + '元' + xianpinleiTxt + '京券' + xianpinleiguanggao + '</em>');
                            }
                            // 券会员特享 限购
                            if (huiyuantexiang_xianguo) {
                                promotionsItems.push('<em class="hl_red_bg">赠券</em><em class="hl_red">' + levelText + '及以上会员赠' + value.couponQouta + '元' + xianpinleiTxt + '京券' + xianpinleiguanggao + '，且' + limText + '</em>');
                            }
                            // 券限购
                            if (xiangou) {
                                promotionsItems.push('<em class="hl_red_bg">赠券</em><em class="hl_red">赠' + value.couponQouta + '元' + xianpinleiTxt + '京券' + xianpinleiguanggao + '，且' + limText + '</em>');
                            }
                            // 普通赠券
                            if (normal) {
                                promotionsItems.push('<em class="hl_red_bg">赠券</em><em class="hl_red">赠' + value.couponQouta + '元' + xianpinleiTxt + '京券' + xianpinleiguanggao + '</em>');
                            }
                        }
                    });
                }
            }

            // 获取京豆
            function setScore(score) {
                if (score > 0) {
                    // 京豆会员特享
                    if (huiyuantexiang) {
                        promotionsItems.push('<em class="hl_red_bg">赠京豆</em><em class="hl_red">' + levelText + '及以上会员赠' + score + '京豆</em>');
                    }
                    // 京豆会员特享 限购
                    if (huiyuantexiang_xianguo) {
                        promotionsItems.push('<em class="hl_red_bg">赠京豆</em><em class="hl_red">' + levelText + '及以上会员赠' + score + '京豆，且' + limText + '</em>');
                    }
                    // 京豆限购
                    if (xiangou) {
                        promotionsItems.push('<em class="hl_red_bg">赠京豆</em><em class="hl_red">赠' + score + '京豆，且' + limText + '</em>');
                    }
                    // 普通赠京豆
                    if (normal) {
                        promotionsItems.push('<em class="hl_red_bg">赠京豆</em><em class="hl_red">赠' + score + '京豆</em>');
                    }
                }
            }

            //单品促销
            if (infoList[i].promoType == 1) {
                // 会员特享
                if (infoList[i].price > 0) {
                    var vipTeXiangItem = null;
                    if (huiyuantexiang) {
                        vipTeXiangItem = '<em class="hl_red_bg">会员特享</em><em class="hl_red">' + levelText + '及以上会员价：' + infoList[i].price.replace('.00','').replace('.0','') + '元</em>';
                        promotionsItems.push(vipTeXiangItem);
                    }
                    if (huiyuantexiang_xianguo) {
                        vipTeXiangItem = '<em class="hl_red_bg">会员特享</em><em class="hl_red">' + levelText + '及以上会员价：' + infoList[i].price.replace('.00','').replace('.0','') + '元，且' + limText + '</em>';
                        promotionsItems.push(vipTeXiangItem);
                    }
                }
                // 普通直降
                if (infoList[i].discount > 0 && normal) {
                    promotionsItems.push('<em class="hl_red_bg">直降</em><em class="hl_red">已优惠' + infoList[i].discount.replace('.00','').replace('.0','') + '元</em>');
                }
                // 限购
                if (infoList[i].discount > 0 && xiangou) {
                    if (infoList[i].minNum <= 1) {
                        promotionsItems.push('<em class="hl_red_bg">限购</em><em class="hl_red">已优惠' + infoList[i].discount.replace('.00','').replace('.0','') + '元，且' + limText + '</em>');
                    } else if (infoList[i].price > 0) {
                        promotionsItems.push('<em class="hl_red_bg">限购</em><em class="hl_red">每件可享受优惠价' + infoList[i].price.replace('.00','').replace('.0','') + '元，且' + limText + '</em>');
                    }
                }
                //京豆优惠购
                if (false && jBean && infoList[i].price > 0) {
                    var jBeanCondition = '';
                    if (buyNum != '' && buyNum != null) {
                        jBeanCondition = '（条件：' + buyNum + '）';
                    }
                    var jBeanItem = '<em class="hl_red_bg">京豆优惠购</em><em class="hl_red">使用'
                        + infoList[i].needJBeanNum + '京豆可享受优惠价'
                        + infoList[i].price.replace('.00','').replace('.0','') + '元' + jBeanCondition + '</em>';
                    promotionsItems.push(jBeanItem);
                }
                setCoupon(infoList[i].adwordCouponList);
                setScore(infoList[i].score);
            }
            //赠品条件
            var giftCondition = '';
            if (huiyuantexiang_xianguo || xiangou) {
                giftCondition = huiyuantexiang_xianguo ? '（条件：' + buyNum + '、' + levelText + '及以上会员）' : '（条件：' + buyNum + '）';
            }
            if (huiyuantexiang) {
                giftCondition = '（条件：' + levelText + '及以上会员）';
            }

            //买多赠多
            if (infoList[i].promoType == 2 && infoList[i].minNum > 1) {
                // promotionsItems.push('<em class="hl_red_bg">满赠</em>购买' + infoList[i].minNum + '件即得下方赠品');
                var giftList = infoList[i].adwordGiftSkuList;
                if (giftList.length > 0 & giftList !== null) {
                    promotionsItems.push('<em class="hl_red_bg">赠品</em><em class="hl_red">赠下方的热销商品，赠完即止' + giftCondition + '</em>');
                    var res = gift_TPL_F(infoList[i]);
                    if (res !== '') {
                        giftsItems.push(res);
                    }
                }
            }
            // 封顶促销
            if (infoList[i].promoType == 15 && infoList[i].rebate > 0) {
                var rebate = infoList[i].rebate;
                var bookTopAdword = '<em class="hl_red_bg">封顶</em><em class="hl_red">本商品参与' + (rebate * 10).toFixed(1) + '折封顶活动</em>';
                var adwordLink = infoList[i].adwordUrl;
                promotionsItems.push(bookTopAdword);
            }
            // 赠品促销
            if (infoList[i].promoType == 4) {
                var giftList = infoList[i].adwordGiftSkuList, flag=false, res='';
                if (giftList.length > 0 & giftList !== null) {
                    for (var k = 0; k < giftList.length; k++) {
                        if (giftList[k].giftType == 2) {
                        	flag = true;
                            promotionsItems.push('<em class="hl_red_bg">赠品</em><em class="hl_red">赠下方的热销商品，赠完即止' + giftCondition + '</em>');
                            break;
                        }
                    }

                    if (flag) res = gift_TPL_F(infoList[i]);
                    if (res !== '') {
                        giftsItems.push(res);
                    }
                }
                setCoupon(infoList[i].adwordCouponList);
                setScore(infoList[i].score);
            }
            //满返满赠促销
            if (infoList[i].promoType == 10) {
            	promotHtml.promoId.push(infoList[i].promoId);
                //满 赠、返
                var FULL_REFUND = 1;
                //每满赠、返
                var FULL_REFUND_PER = 2;
                //加价购
                var EXTRA_PRICE = 4;
                //阶梯满减
                var FULL_LADDER = 6;
                //满返百分比
                var PERCENT = 8;
                // M元买N件
                var FULLREFUND_MPRICE_NNUM = 13;
                // 满M件赠
                var FULLREFUND_MNUN_ZENG = 14;
                // 满M件N折
                var FULLNUM_MNUM_NREBATE = 15;
                // 满返满赠叠加促销
                var FULLPRICE_MFMZ = 16;
                // 满M件N折和满赠叠加促销
                var FULLNUM_REBATE_MFMZ = 17;
                //满减池促销
                var FULL_POOL = 20;
                //满返满赠促销子类型
                var fullRefundType = infoList[i].fullRefundType;
                var reward = infoList[i].reward ? infoList[i].reward.replace('.00','').replace('.0','') : infoList[i].reward;
                var needMoney = infoList[i].needMondey ? infoList[i].needMondey.replace('.00','').replace('.0','') : infoList[i].needMondey;
                var mzNeedMoney = infoList[i].mzNeedMoney ? infoList[i].mzNeedMoney.replace('.00','').replace('.0','') : infoList[i].mzNeedMoney;
                var mzNeedNum = infoList[i].mzNeedNum;
                var needNum = infoList[i].needNum;
                var addMoney = infoList[i].addMoney ? infoList[i].addMoney.replace('.00','').replace('.0','') : infoList[i].addMoney;
                var topMoney = infoList[i].topMoney ? infoList[i].topMoney.replace('.00','').replace('.0','') : infoList[i].topMoney;
                var percent = infoList[i].percent;
                var rebate = infoList[i].rebate;
                var deliverNum = infoList[i].deliverNum;
                var score = infoList[i].score;
                var couponList = infoList[i].adwordCouponList;
                var haveGifts = infoList[i].haveFullRefundGifts;
                var jq = 0;
                var fullLadderList = infoList[i].fullLadderDiscountList;
                var adwordLink = infoList[i].adwordUrl;
                var mfmzExtType = infoList[i].mfmzExtType;
                //拼接满返满赠信息
                var fullRefundInfo = "";
                if (couponList != null && couponList.length > 0) {
                    $each(couponList, function (z, couponValue) {
                        if (couponValue.type == 1) {
                            jq = jq + coupon.couponQouta;
                        }
                    });
                }
                if (fullRefundType == FULL_REFUND) {
                    if (fullLadderList != null && fullLadderList.length > 0) {
                        $each(fullLadderList, function (z, fullLadderValue) {
                            var fNeedMoney = fullLadderValue.needMoney ? fullLadderValue.needMoney.replace('.00','').replace('.0','') : fullLadderValue.needMoney;
                            var fRewardMoney = fullLadderValue.rewardMoney ? fullLadderValue.rewardMoney.replace('.00','').replace('.0','') : fullLadderValue.rewardMoney;
                            var fAddMoney = fullLadderValue.addMoney ? fullLadderValue.addMoney.replace('.00','').replace('.0','') : fullLadderValue.addMoney;
                            if (fNeedMoney > 0 && fRewardMoney > 0 && !haveGifts) {
                                var isFirstSign = z == 0 ? '' : '，';
                                var tipsHtml = z == 0 ? '<em class="hl_red_bg">满减</em>' : '';
                                fullRefundInfo = (fullRefundInfo + tipsHtml + '<em class="hl_red">' + isFirstSign + '满' + fNeedMoney + '元减' + fRewardMoney + '元</em>');
                            }
                            if (haveGifts) {
                                var isFirstSign = z == 0 ? '' : '；';
                                if (fNeedMoney > 0 && fRewardMoney > 0 && fAddMoney > 0) {
                                    var tipsHtml = z == 0 ? '<em class="hl_red_bg">满送</em>' : '';
                                    fullRefundInfo = (fullRefundInfo + tipsHtml + '<em class="hl_red">' + isFirstSign + '满' + fNeedMoney + '元减' + fRewardMoney + '元以折扣价购买热销商品</em>');
                                } else if (fNeedMoney > 0 && fRewardMoney > 0 && fAddMoney <= 0) { //满减赠
                                    var tipsHtml = z == 0 ? '<em class="hl_red_bg">满送</em>' : '';
                                    fullRefundInfo = (fullRefundInfo + tipsHtml + '<em class="hl_red">' + isFirstSign + '满' + fNeedMoney + '元减' + fRewardMoney + '元、得赠品（赠完即止）</em>');
                                } else if (fNeedMoney > 0 && fRewardMoney <= 0 && fAddMoney > 0) {
                                    var tipsHtml = z == 0 ? '<em class="hl_red_bg">加价购</em>' : '';
                                    fullRefundInfo = (fullRefundInfo + tipsHtml + '<em class="hl_red">' + isFirstSign + '满' + fNeedMoney + '元以折扣价购买热销商品</em>');
                                } else {
                                    var tipsHtml = z == 0 ? '<em class="hl_red_bg">满赠</em>' : '';
                                    fullRefundInfo = (fullRefundInfo + tipsHtml + '<em class="hl_red">' + isFirstSign + '满' + fNeedMoney + '元即赠热销商品，赠完即止</em>');
                                }
                            }
                            if (jq > 0 && fNeedMoney > 0) {
                                var isFirstSign = z == 0 ? '' : '；';
                                var tipsHtml = z == 0 ? '<em class="hl_red_bg">满赠</em>' : '';
                                fullRefundInfo = (fullRefundInfo + tipsHtml + '<em class="hl_red">' + isFirstSign + '满' + fNeedMoney + '元，赠' + jq + '元京券</em>');
                            }
                            if (fNeedMoney > 0 && percent > 0) {
                                var isFirstSign = z == 0 ? '' : '；';
                                var tipsHtml = z == 0 ? '<em class="hl_red_bg">满减</em>' : '';
                                percent = percent * 100;
                                fullRefundInfo = (fullRefundInfo + tipsHtml + '<em class="hl_red">' + isFirstSign + '满' + fNeedMoney + '元，可减' + percent + '%</em>');
                            }
                        });
                    }
                } else if (fullRefundType == FULL_REFUND_PER) {
                    if (needMoney > 0 && reward > 0) {
                        fullRefundInfo = '<em class="hl_red_bg">满减</em><em class="hl_red">每满' + needMoney + '元，可减' + reward + '元现金</em>';
                        if (topMoney > 0) {
                            fullRefundInfo += '<em class="hl_red">，最多可减' + topMoney + '元</em>';
                        }
                    } else {
                        if (haveGifts) {
                            fullRefundInfo = '<em class="hl_red_bg">满赠</em><em class="hl_red">每满' + needMoney + '元即赠，赠完即止</em>';
                        } else if (jq > 0) {
                            fullRefundInfo = '<em class="hl_red_bg">满赠</em><em class="hl_red">每满' + needMoney + '元，即赠' + jq + '元京券</em>';
                        }
                    }
                } else if (fullRefundType == EXTRA_PRICE) {
                    if (needMoney > 0 && addMoney > 0) {
                        fullRefundInfo = '<em class="hl_red_bg">加价购</em><em class="hl_red">满' + needMoney + '元另加' + addMoney.replace('.00','').replace('.0','') + '元即可购买热销商品</em>';
                    }
                } else if (fullRefundType == PERCENT) {
                    if (needMoney > 0 && percent > 0) {
                        percent = percent * 100;
                        fullRefundInfo = '<em class="hl_red_bg">满减</em><em class="hl_red">满' + needMoney + '元，可减' + percent + '%</em>';
                    }
                } else if (fullRefundType == FULL_LADDER) {
                    if (fullLadderList != null && fullLadderList.length > 0) {
                        //fullRefundInfo = '<em class="hl_red_bg">满减</em>该商品参加阶梯满减活动，购买活动商品<br/>';
                        $each(fullLadderList, function (z, fullLadderValue) {
                            var tipsHtml = z == 0 ? '<em class="hl_red_bg">满减</em>' : '',
                                isFirstSign = z == 0 ? '' : '，';
                            if (fullLadderValue.needMoney > 0 && fullLadderValue.rewardMoney > 0) {
                                fullRefundInfo = (fullRefundInfo + tipsHtml + '<em class="hl_red">' + isFirstSign + '满' + fullLadderValue.needMoney.replace('.00','').replace('.0','') + '元减' + fullLadderValue.rewardMoney.replace('.00','').replace('.0','') + '元</em>');
                            }
                        });
                        //fullRefundInfo = fullRefundInfo.substring(0, fullRefundInfo.length - 1)
                    }
                } else if (fullRefundType == 11) {
                    // 满返满赠促销大类型
                    var tipsHTML = '<em class="hl_red_bg">多买优惠</em><em class="hl_red">满' + infoList[i].needNum + '件，立减最低' + infoList[i].deliverNum + '件商品价格</em>';
                    if (tipsHTML !== '') {
                        promoType10.push(tipsHTML);
                    }
                } else if (fullRefundType == FULL_POOL) {
                    // 跨品类满减促销
                    var list = infoList[i].fullLadderDiscountList,
                        len = list.length, f, resText = [], resLink = infoList[i].adwordUrl;
                    for (f = 0; f < len && len > 0; f++) {
                        if(list[f].rebate > 0) {
                            resText.push('满' + parseInt(list[f].needMoney.replace('.00','').replace('.0','')) + '元打' + (list[f].rebate * 10).toFixed(1) +'折');
                        } else {
                            resText.push('满' + parseInt(list[f].needMoney.replace('.00','').replace('.0','')) + '元减' + parseInt(list[f].rewardMoney.replace('.00','').replace('.0','')) + '元');
                        }
                    }
                    if (len > 0) {
                        var conditionTxt = '';
                        if (list[0].maxSkuNumInPool > 0) {
                            conditionTxt = '<em class="hl_red">每类商品最多购买' + list[0].maxSkuNumInPool + '件';
                        }
                        if (list[0].minTotalSkuNum > 1) {
                            conditionTxt += '<em class="hl_red">至少' + list[0].minTotalSkuNum + '件';
                        }
                        if (list[0].poolSkuUnique > 0) {
                            conditionTxt += '<em class="hl_red">且型号不同';
                        }
                        if (conditionTxt.length > 1) {
                            conditionTxt += ",";
                        }

                        promoType10.push('<em class="hl_red_bg">满减</em><em class="hl_red">' + conditionTxt + ' 购满' + list[0].minPoolNum + '类商品，' + resText.join('、') + '</em>');
                    }
                } else if (fullRefundType == FULLREFUND_MPRICE_NNUM) {
                    if (needMoney > 0 && deliverNum > 0) {
                        fullRefundInfo = '<em class="hl_red_bg">满减</em><em class="hl_red">满' + needMoney + '元买' + deliverNum + '件</em>';
                    }
                } else if (fullRefundType == FULLREFUND_MNUN_ZENG) {
                    if (haveGifts && needNum > 0) {
                        fullRefundInfo = '<em class="hl_red_bg">满赠</em><em class="hl_red">满' + needNum + '件即赠热销商品，赠完即止</em>';
                    }
                    if (needNum > 0 && rebate > 0) {
                        fullRefundInfo = '<em class="hl_red_bg">多买优惠</em><em class="hl_red">满' + needNum + '件，总价打' + (rebate * 10).toFixed(1) + '折</em>';
                    }

                } else if (fullRefundType == FULLNUM_MNUM_NREBATE) {
                    if (fullLadderList != null && fullLadderList.length > 0) {
                        $each(fullLadderList, function (z, fullLadderValue) {
                            var tipsHtml = z == 0 ? '<em class="hl_red_bg">多买优惠</em>' : '',
                                isFirstSign = z == 0 ? '' : '；';
                            if (fullLadderValue.needNum > 0 && fullLadderValue.rebate > 0) {
                                fullRefundInfo = (fullRefundInfo + tipsHtml + '<em class="hl_red">' + isFirstSign + '满' + fullLadderValue.needNum + '件，总价打' + (fullLadderValue.rebate * 10).toFixed(1) + '折</em>');
                            }
                        });
                    } else {
                        if (needNum > 0 && rebate > 0) {
                            fullRefundInfo = '<em class="hl_red_bg">多买优惠</em><em class="hl_red">满' + needNum + '件，总价打' + (rebate * 10).toFixed(1) + '折</em>';
                        }
                    }
                } else if (fullRefundType == FULLPRICE_MFMZ) {
                    var mfmzExtTypeMF = 1;
                    var mfmzExtTypeMZ = 2;
                    var mfmzExtTypeMFJT = 3;
                    var mfmzExtTypeMZJT = 4;
                    var mfmzExtTypeMFMZ = 5;
                    if (mfmzExtType === mfmzExtTypeMF) {
                        $each(fullLadderList, function (z, fullLadderValue) {
                            if (fullLadderValue.needMoney > 0 && fullLadderValue.rewardMoney > 0) {
                                fullRefundInfo = '<em class="hl_red_bg">满送</em><em class="hl_red">满' + fullLadderValue.needMoney.replace('.00','').replace('.0','') + '元立减' + fullLadderValue.rewardMoney.replace('.00','').replace('.0','') + '元</em>';
                            }
                        });
                    }
                    if (mfmzExtType === mfmzExtTypeMZ) {
                        $each(fullLadderList, function (z, fullLadderValue) {
                            if (fullLadderValue.rewardMoney <= 0 && fullLadderValue.needMoney > 0 && fullLadderValue.addMoney <= 0) {
                                fullRefundInfo = '<em class="hl_red_bg">满送</em><em class="hl_red">满' + fullLadderValue.needMoney.replace('.00','').replace('.0','') + '元即赠热销商品，赠完即止</em>';
                            }
                            if (fullLadderValue.rewardMoney <= 0 && fullLadderValue.needMoney > 0 && fullLadderValue.addMoney > 0) {
                                fullRefundInfo = '<em class="hl_red_bg">满送</em><em class="hl_red">满' + fullLadderValue.needMoney.replace('.00','').replace('.0','') + '元另加' + fullLadderValue.addMoney.replace('.00','').replace('.0','') + '元即赠热销商品，赠完即止</em>';
                            }
                        });
                    }
                    if (mfmzExtType === mfmzExtTypeMFJT) {
                        $each(fullLadderList, function (z, fullLadderValue) {
                            var tipsHtml = z == 0 ? '<em class="hl_red_bg">满送</em>' : '',
                                isFirstSign = z == 0 ? '' : '，';
                            if (fullLadderValue.needMoney > 0 && fullLadderValue.rewardMoney > 0) {
                                fullRefundInfo = (fullRefundInfo + tipsHtml + '<em class="hl_red">' + isFirstSign + '满' + fullLadderValue.needMoney.replace('.00','').replace('.0','') + '元减' + fullLadderValue.rewardMoney.replace('.00','').replace('.0','') + '元</em>');
                            }
                        });
                    }
                    if (mfmzExtType === mfmzExtTypeMZJT) {
                        if (addMoney <= 0) {
                            $each(fullLadderList, function (z, fullLadderValue) {
                                var tipsHtml = z == 0 ? '<em class="hl_red_bg">满赠</em><em class="hl_red">' : '',
                                    isFirstSign = z == 0 ? '' : '，或';
                                if (fullLadderValue.needMoney > 0) {
                                    fullRefundInfo = (fullRefundInfo + tipsHtml + isFirstSign + '满' + fullLadderValue.needMoney.replace('.00','').replace('.0','') + '元得赠品');
                                }
                            });
                            fullRefundInfo += '，赠完即止</em>';
                        }
                        if (addMoney > 0) {
                            $each(fullLadderList, function (z, fullLadderValue) {
                                var tipsHtml = z == 0 ? '<em class="hl_red_bg">加价购</em><em class="hl_red">' : '',
                                    isFirstSign = z == 0 ? '' : '，或';
                                if (fullLadderValue.needMoney > 0) {
                                    fullRefundInfo = (fullRefundInfo + tipsHtml + isFirstSign + '满' + fullLadderValue.needMoney.replace('.00','').replace('.0','') + '元另加' + fullLadderValue.addMoney.replace('.00','').replace('.0','') + '元' );
                                }
                            });
                            fullRefundInfo += '，即可购买热销商品</em>';
                        }
                    }
                    if (mfmzExtType === mfmzExtTypeMFMZ) {
                        $each(fullLadderList, function (z, fullLadderValue) {
                            var tipsHtml = z == 0 ? '<em class="hl_red_bg">满送</em>' : '';
                            var fullRefundInfo1 = '';
                            var fullRefundInfo2 = '';
                            fullRefundInfo += tipsHtml;
                            if (fullLadderValue.mfmzTag == 1) {
                                fullRefundInfo1 += '<em class="hl_red">满' + fullLadderValue.needMoney.replace('.00','').replace('.0','') + '元立减' + fullLadderValue.rewardMoney.replace('.00','').replace('.0','') + '元</em>';
                            }
                            if (fullLadderValue.mfmzTag == 2 && fullLadderValue.addMoney <= 0) {
                                fullRefundInfo2 += '，减后满' + fullLadderValue.needMoney.replace('.00','').replace('.0','') + '元即可购买热销商品</em>';
                            }
                            if (fullLadderValue.mfmzTag == 2 && fullLadderValue.addMoney > 0) {
                                fullRefundInfo2 += '，减后满' + fullLadderValue.needMoney.replace('.00','').replace('.0','') + '元另加' + fullLadderValue.addMoney.replace('.00','').replace('.0','') + '元即可购买热销商品</em>';
                            }
                            fullRefundInfo += fullRefundInfo1 + fullRefundInfo2;
                        });
                    }
                    // if ( needMoney > 0 && reward > 0 && mzNeedMoney <=0 ) {
                    // fullRefundInfo = '<em class="hl_red_bg">满送</em><em class="hl_red">满' + needMoney + '立减' + reward + '</em>';
                    // }
                    // if (reward <= 0 && mzNeedMoney > 0 && addMoney <= 0 ) {
                    // fullRefundInfo = '<em class="hl_red_bg">满送</em><em class="hl_red">满' + mzNeedMoney + '元即赠热销商品，赠完即止</em>';
                    // }
                    // if (reward <= 0 && mzNeedMoney > 0 && addMoney > 0 ) {
                    // fullRefundInfo = '<em class="hl_red_bg">满送</em><em class="hl_red">满' + mzNeedMoney + '元另加' + addMoney + '元即赠热销商品，赠完即止</em>';
                    // }
                    // if ( needMoney > 0 && reward > 0 && mzNeedMoney > 0 && addMoney <= 0 ) {
                    // fullRefundInfo = '<em class="hl_red_bg">满送</em><em class="hl_red">满' + needMoney + '立减' + reward + '，减后满' + mzNeedMoney + '元即可购买热销商品</em>';
                    // }
                    // if ( needMoney > 0 && reward > 0 && mzNeedMoney > 0 && addMoney > 0 ) {
                    // fullRefundInfo = '<em class="hl_red_bg">满送</em><em class="hl_red">满' + needMoney + '立减' + reward + '，减后满' + mzNeedMoney + '元另加' + addMoney + '元即可购买热销商品</em>';
                    // }
                } else if (fullRefundType == FULLNUM_REBATE_MFMZ) {
                    if (needNum > 0 && rebate > 0 && addMoney <= 0 && mzNeedNum > 0) {
                        fullRefundInfo = '<em class="hl_red_bg">满送</em><em class="hl_red">满' + needNum + '件，总价打' + (rebate * 10).toFixed(1) + '折，且赠热销商品，赠完即止</em>';
                    }
                    if (needNum > 0 && rebate > 0 && addMoney > 0 && mzNeedNum > 0) {
                        fullRefundInfo = '<em class="hl_red_bg">满送</em><em class="hl_red">满' + needNum + '件，总价打' + (rebate * 10).toFixed(1) + '折，再加' + addMoney.replace('.00','').replace('.0','') + '元赠热销商品，赠完即止</em>';
                    }
                    if (mzNeedNum <= 0 && needNum > 0 && rebate > 0) {
                        fullRefundInfo = '<em class="hl_red_bg">满送</em><em class="hl_red">满' + needNum + '件，总价打' + (rebate * 10).toFixed(1) + '折</em>';
                    }
                    if (mzNeedNum > 0 && addMoney <= 0 && rebate <= 0) {
                        fullRefundInfo = '<em class="hl_red_bg">满送</em><em class="hl_red">满' + mzNeedNum + '件赠热销商品，赠完即止</em>';
                    }
                    if (mzNeedNum > 0 && addMoney > 0 && rebate <= 0) {
                        fullRefundInfo = '<em class="hl_red_bg">满送</em><em class="hl_red">满' + mzNeedNum + '件，再加' + addMoney.replace('.00','').replace('.0','') + '元赠热销商品，赠完即止</em>';
                    }
                }
                var fullRefundTotalInfo = "";
                if (fullRefundInfo != "") {
                    if(infoList[i].promoTags){
                    	var tagstr = ','+infoList[i].promoTags.join(',')+',';
                    	if(tagstr.indexOf(',1,') != -1){
                    		fullRefundInfo = fullRefundInfo.replace(/满减/g, '跨店铺满减');
                    	}
                    }
                    fullRefundTotalInfo = fullRefundInfo;
                }
                if (fullRefundTotalInfo !== '') {
                    promoType10.push(fullRefundTotalInfo);
                }
            }

            // 是否限时打折
            if (infoList[i].limitTimePromo == 1) {
                if ($('#a-tips').length < 1) {
                    $('#summary-price strong').after('<em id="a-tips">&nbsp;促销即将结束&nbsp;</em>');
                }
            }
        }
    }
    
    (function () {
        var txtPerfix = '本商品不能使用',
            txtDq = '',
            txtJq = '',
            txtTips = '',
            infoList = result.infoList;
        if (!infoList || infoList.length < 1) {
            return;
        }
        for (var m = 0; m < infoList.length; m++) {
            if (infoList[m] === 1) {
                txtDq += ' 东券';
            }
            if (infoList[m] === 2) {
                txtJq += ' 京券';
            }
            if (false && infoList[m] === 3) {
                txtTips += '<a class="hl_red" href="http://help.360buy.com/help/question-97.html" target="_blank" title="售后到家（仅针对京东指定商品）：自商品售出一年内，如出现质量问题，京东将提供免费上门取送及原厂授权维修服务。">赠送一年期京东售后到家服务（上门取送维修）</a><br/>'
            }
        }
        if (txtDq === '' && txtJq === '') {
            tipsItems.push(txtTips);
        } else {
            tipsItems.push('<em class="hl_red">' + txtPerfix + txtDq + txtJq + '</em><br/>');
            tipsItems.push(txtTips);
        }
    })();
    // 奢侈品
    if (false&& pageConfig.product.tips == true) {
        var strPerfix = tipsItems.length > 0 ? '<br/>' : '';
        tipsItems.push(strPerfix + '<span>此商品尊享7天无忧退换货服务</span>');
    }
    // 赠品提示
    if (giftsItems.length > 0) {
        promotHtml.giftsDiv = giftsItems.join('');
    }
    // 促销信息
    if (promotionsItems.length > 0 || promoType10.length > 0) {
        var resPromoType10 = [];
        var tipsForCart = '<span>以下促销，可在购物车任选其一</span>';

        if (false&& pageConfig.product.specialAttrs && pageConfig.product.isLOC) {
            tipsForCart = '<span>以下促销，只可享受其中一种</span>';
        }

        if (promoType10.length > 1) {
            if (promotionsItems.length > 0) {
                resPromoType10 = ['<br/>' + tipsForCart].concat(promoType10);
            } else {
                resPromoType10 = [tipsForCart].concat(promoType10);
            }
        } else {
            if (promotionsItems.length > 0 && promoType10[0]) {
                promoType10[0] = '<br/>' + promoType10[0];
            }
            resPromoType10 = promoType10;
        }

        promotHtml.promotionsDiv += ( promotionsItems.join('<br/>') + resPromoType10.join('<br/>'));
        promotHtml.promotionsItemsArr = promotHtml.promotionsItemsArr.concat(promotionsItems);
        promotHtml.promotionsItemsType10Arr = promotHtml.promotionsItemsType10Arr.concat(promoType10);
       
    }

    // 促销信息 extra
    if (promotionsItemsExtra.length > 0) {
        promotHtml.promotionsExtraDiv = (promotionsItemsExtra.join('&nbsp;&nbsp;&nbsp;&nbsp;'));
    }
    // 温馨提示
    if (tipsItems.length > 0) {
        promotHtml.tips += (tipsItems.join('&nbsp;'));
    }
    return promotHtml;
}
function getNewUserLevel(e){switch(e){case 50:return"\u6ce8\u518c\u7528\u6237";case 56:return"\u94dc\u724c\u7528\u6237";case 59:return"\u6ce8\u518c\u7528\u6237";case 60:return"\u94f6\u724c\u7528\u6237";case 61:return"\u94f6\u724c\u7528\u6237";case 62:return"\u91d1\u724c\u7528\u6237";case 63:return"\u94bb\u77f3\u7528\u6237";case 64:return"\u7ecf\u9500\u5546";case 110:return"VIP";case 66:return"\u4eac\u4e1c\u5458\u5de5";case-1:return"\u672a\u6ce8\u518c";case 88:return"\u94bb\u77f3\u7528\u6237";case 90:return"\u4f01\u4e1a\u7528\u6237";case 103:return"\u94bb\u77f3\u7528\u6237";case 104:return"\u94bb\u77f3\u7528\u6237";case 105:return"\u94bb\u77f3\u7528\u6237"}return"\u672a\u77e5"}
function $each( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	}