game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"Key杀",content:function (config,pack){
    //设置键势力的颜色
        var style2=document.createElement('style');
        style2.innerHTML=".player .identity[data-color='key'],";
        style2.innerHTML=".player .identity[data-color='xKey'],";
	    style2.innerHTML+="div[data-nature='key'],";
    	style2.innerHTML+="span[data-nature='key'] {text-shadow: black 0 0 1px,rgba(203, 177, 255,1) 0 0 2px,rgba(203, 177, 255,1) 0 0 5px,rgba(203, 177, 255,1) 0 0 10px,rgba(203, 177, 255,1) 0 0 10px}";
    	style2.innerHTML+="div[data-nature='keym'],";
	    style2.innerHTML+="span[data-nature='keym'] {text-shadow: black 0 0 1px,rgba(203, 177, 255,1) 0 0 2px,rgba(203, 177, 255,1) 0 0 5px,rgba(203, 177, 255,1) 0 0 5px,rgba(203, 177, 255,1) 0 0 5px,black 0 0 1px;}";
    	style2.innerHTML+="div[data-nature='keymm'],";
    	style2.innerHTML+="span[data-nature='keymm'] {text-shadow: black 0 0 1px,rgba(203, 177, 255,1) 0 0 2px,rgba(203, 177, 255,1) 0 0 2px,rgba(203, 177, 255,1) 0 0 2px,rgba(203, 177, 255,1) 0 0 2px,black 0 0 1px;}";
    	document.head.appendChild(style2);
        //使键势力角色能够读取到自己的颜色
        get.groupnature=function(group,method){
			var nature;
			switch(group){
				case 'shen':nature='thunder';break;
				case 'wei':nature='water';break;
				case 'shu':nature='soil';break;
				case 'wu':nature='wood';break;
				case 'qun':nature='metal';break;
				case 'key':nature='key';break;
                case 'xKey':nature='key';break;
				default:return '';
			}
			if(method=='raw'){
				return nature;
			}
			return nature+'mm';
		}
    lib.group.push('xKey');
    lib.translate.xKey='键';
    lib.characterTitle.shiroha='key社信仰';
    lib.characterTitle.ryuichi='跳不出来的圈';
    lib.characterTitle.kobato='使命的召唤者';
    lib.characterTitle.umi='血小◆';
    lib.characterTitle.umi2='血小◆';
    lib.characterTitle.kotomi='Titan_Gin';
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            shiroha:["male","xKey",3,["key_yuzhao","key_diefan"],[]],
            ryuichi:["male","xKey",4,["key_baoyi","key_tuipi2"],[]],
            kobato:["male","xKey",4,["key_shuizhan","key_shendun"],[]],
            umi:["female","xKey",3,["key_xunhuan","key_chaofan","key_qihuan"],[]],
            "umi2":["female","xKey",3,[],["unseen","forbidai"]],
            ao:["female","xKey",3,["key_kuihun","key_jiyang","key_shiran"],[]],
            kotomi:["female","xKey",3,["key_kotomi1","key_kotomi2","key_kotomi3"],[]],
        },
        translate:{
            shiroha:"鸣濑白羽",
            ryuichi:"三谷良一",
            kobato:"鸣濑小鸠",
            umi:"加藤うみ",
            "umi2":"鹰原羽未",
            ao:"空门苍",
            kotomi:"一之濑琴美",
        },
    },
    card:{
        card:{
        },
        translate:{
        },
        list:[],
    },
    skill:{
        skill:{
            "key_xunjie":{
                audio:"ext:Key杀:2",
                trigger:{
                    global:"respond",
                },
                filter:function (event,player){
        if(![event.player,event.source].contains(player)) return false;
        return get.type(event.card)=='basic';
    },
                direct:true,
                content:function (){
        'step 0'
        player.chooseTarget(get.prompt('key_xunjie')).set('ai',function(target){
            var num=get.attitude(_status.event.player,target);
            if(target.countDiscardableCards(_status.event.player,'he')) return Math.abs(num);
            return num;
        });
        'step 1'
        if(result.bool){
            player.logSkill('key_xunjie',result.targets);
            player.line(result.targets[0],'water');
            event.target=result.targets[0];
            if(event.target.countDiscardableCards(player,'hej')==0) event.goto(2);
            player.chooseControl(['摸牌','弃牌']).set('ai',function(){
                return get.attitude(_status.event.player,event.target)>0?'摸牌':'弃牌';
            });
        }
        else event.finish();
        'step 2'
        if(result.control=='弃牌'){
            player.discardPlayerCard(event.target,'hej',true);
        }
        else event.target.draw();
    },
            },
            "key_yuzhao":{
                audio:"ext:Key杀:2",
                trigger:{
                    player:"phaseUseBegin",
                },
                check:function (event,player){
        if(player.hp>2) return true;
        return player.hp>1&&game.hasPlayer(function(current){
            return current.sex=='male'&&get.attitude(player,current)>0
        });
    },
                content:function (){
        'step 0'
        var list=[];
        for(var i=0;i<player.hp;i++){
            list.push(get.cnNumber(i+1,true));
        }
        player.chooseControl(list).set('prompt','请选择要失去的体力值');
        'step 1'
        if(!result.control) result.control='一';
        else{
            for(var i=1;i<player.hp+1;i++){
                if(get.cnNumber(i,true)==result.control) break;
            }
            player.loseHp(i);
            player.storage.key_yuzhao2=i;
            player.addTempSkill('key_yuzhao2',{player:'phaseBefore'});
        }
    },
            },
            "key_diefan":{
                audio:"ext:Key杀:2",
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return player!=target&&target.sex=='male';
    },
                content:function (){
        "step 0"
        if(target.countCards('h',{suit:'heart'})&&player.countCards('h')){
            target.chooseControl().set('choiceList',[
                '获得'+get.translation(player)+'的一张手牌，然后令其回复一点体力',
                '交给'+get.translation(player)+'一张红桃手牌，然后回复一点体力',
            ]).set('ai',function(){
                if(get.attitude(target.player)>0&&target.hp>player.hp) return 0;
                return 1;
            });
        }
        else if(player.countCards('h')) event._result={index:0}; 
        else if(target.countCards('h',{suit:'heart'})) event._result={index:1};
        else event.finish();
        "step 1"
        if(result.index==0){
            target.gainPlayerCard(player,'h',true);
            player.recover().set('source',target);
            event.finish();
        }
        else{
            target.chooseCard('交给'+get.translation(player)+'一张红桃手牌',function(card){
                return get.suit(card)=='heart';
            }).set('ai',function(card){
                return 25-get.value(card);
            });
        }
        "step 2"
        if(result.bool){
            target.give(result.cards,player);
            target.recover();
        }
    },
                ai:{
                    order:2,
                    result:{
                        player:function (player,target){
                if(player.isDamaged()&&get.attitude(target.player)>0) return 2;
                return 0;
            },
                        target:function (player,target){
                if(target.isDamaged()&&target.countCards('h',{suit:'heart'})) return 2;
                return 1;
            },
                    },
                },
            },
            "key_yuzhao2":{
                mark:true,
                marktext:"召",
                intro:{
                    content:"<li>手牌上限+#<br><li>下次受到的伤害-#",
                },
                silent:true,
                popup:false,
                trigger:{
                    player:"damageBegin",
                },
                forced:true,
                filter:function (event,player){
        return player.storage.key_yuzhao2>0;
    },
                priority:-9.5,
                content:function (){
        player.logSkill('key_yuzhao');
        player.removeSkill('key_yuzhao2');
        trigger.num-=player.storage.key_yuzhao2;
    },
                mod:{
                    maxHandcard:function (player,num){
            return num+player.storage.key_yuzhao2;
        },
                },
            },
            "key_baoyi":{
                audio:"ext:Key杀:2",
                trigger:{
                    player:"loseEnd",
                },
                direct:true,
                filter:function (event,player){
        for(var i=0;i<event.cards.length;i++){
            if(event.cards[i].original=='e') return true;
        }
        return false;
    },
                content:function (){
        'step 0'
        event.num=0;
        for(var i=0;i<trigger.cards.length;i++){
            if(trigger.cards[i].original=='e') event.num++;
        }
        'step 1'
        player.chooseTarget(get.prompt('key_baoyi'),function(card,player,target){
            if(target==player) return false;
            if(!target.sex) return false;
            if(target.sex=='female') return true;
            return target.countDiscardableCards(player,'hej');
        }).set('ai',function(target){
            return -get.attitude(_status.event.player,target);
        });
        'step 2'
        if(result.bool){
            event.num--;
            var target=result.targets[0];
            player.logSkill('key_baoyi',target);
            player.line(target,'green');
            if(target.sex=='female'){
                target.loseHp();
            }
            else{
                player.discardPlayerCard(target,'he',2,true);
            }
        }
        else event.finish();
        'step 3'
        if(event.num>0) event.goto(1);
        
        
        
        
        
        
    },
                ai:{
                    noe:true,
                    reverseEquip:true,
                    effect:{
                        target:function (card,player,target,current){
                if(get.type(card)=='equip') return [1,3];
            },
                    },
                },
            },
            "key_tuipi2":{
                trigger:{
                    player:"chooseToDiscardBegin",
                },
                forced:true,
                filter:function (event,player){
        return event.parent.name=='phaseDiscard';
    },
                content:function (){
        trigger.position='he';
    },
                mod:{
                    targetEnabled:function (card,player,target){
            if(['guohe','shunshou'].contains(card.name)){
                return false;
            }
        },
                    maxHandcard:function (player,num){
            return num-player.countCards('e');
        },
                },
            },
            "key_shuizhan":{
                audio:"ext:Key杀:2",
                trigger:{
                    player:"useCard",
                },
                filter:function (event,player){
        return event.card.name=='sha';
    },
                checkx:function (event,player){
        var att=0;
        for(var i=0;i<event.targets.length;i++){
            att+=get.attitude(player,event.targets[i]);
        }
        return att<0;
    },
                usable:1,
                direct:true,
                content:function (){
        "step 0"
        var check=lib.skill.key_shuizhan.checkx(trigger,player);
        player.chooseToDiscard(get.prompt('key_shuizhan')).set('ai',function(card){
            if(_status.event.check) return 6-get.value(card);
            return 0;
        }).set('check',check).set('logSkill','key_shuizhan');
        "step 1"
        if(result.bool){
            if(get.color(result.cards[0])=='red'){
                player.addTempSkill('shuizhan_red',{player:'useCardAfter'});
            }
            else{
                player.addTempSkill('shuizhan_black',{player:'useCardAfter'});
            }
        }
        else{
            player.storage.counttrigger.key_shuizhan--;
        }
    },
            },
            "shuizhan_red":{
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
                trigger:{
                    source:"damageBegin",
                },
                filter:function (event){
        return event.card&&event.card.name=='sha'&&event.notLink();
    },
                silent:true,
                popup:false,
                forced:true,
                audio:"ext:Key杀:false",
                content:function (){
        trigger.num++;
    },
            },
            "shuizhan_black":{
                audio:"ext:Key杀:2",
                trigger:{
                    player:"shaBegin",
                },
                silent:true,
                popup:false,
                forced:true,
                content:function (){
        trigger.target.addTempSkill('fengyin');
        if(typeof trigger.shanRequired=='number'){
            trigger.shanRequired++;
        }
        else{
            trigger.shanRequired=2;
        }
    },
            },
            "key_shendun":{
                trigger:{
                    player:"phaseUseEnd",
                },
                direct:true,
                filter:function (event,player){
        return !player.getStat('damage');
    },
                content:function (){
        'step 0'
        player.chooseControl('摸牌','令人回血','取消').set('prompt',get.prompt('key_shendun')).set('ai',function(){
            if(game.hasPlayer(function(current){
                return current!=player&&current.isDamaged()&&get.recoverEffect(current,player,player)>=(Math.max[player.hp-player.countCards('h'),1]);
            })) return '令人回血';
            return '摸牌';
        });
        'step 1'
        if(result.control=='取消') event.finish();
        else if(result.control=='摸牌'){
            player.logSkill('key_shendun');
            player.draw(2);
            event.finish();
        }
        else player.chooseTarget(true,function(card,player,target){
            return target!=player&&target.isDamaged();
        }).set('ai',function(target){
            var player=_status.event.player;
            return get.recoverEffect(current,player,player);
        });
        'step 2'
        if(result.bool&&result.targets&&result.targets.length){
            var target=result.targets[0];
            player.logSkill('key_shendun',target);
            player.line(target,'thunder');
            target.recover();
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
    },
                audio:"ext:Key杀:2",
            },
            "key_xunhuan":{
                trigger:{
                    player:"phaseAfter",
                },
                priority:-50,
                check:function (event,player){
        return player.hp>=2;
    },
                filter:function (event,player){
        return player.countCards('h')<player.hp;
    },
                content:function (){
        player.loseHp();
        player.insertPhase();
    },
            },
            "key_chaofan":{
                audio:"ext:Key杀:2",
                enable:"phaseUse",
                filterCard:function (card,player){
        if(ui.selected.cards.length){
            return get.suit(card)!=get.suit(ui.selected.cards[0]);
        }
        else return true;
    },
                complexCard:true,
                usable:1,
                selectCard:2,
                check:function (card){
        return 6-get.value(card);
    },
                filterTarget:function (card,player,target){
        return target!=player;
    },
                content:function (){
        if(player.hp>2){
            target.draw();
            target.recover();
        }
        else if(player.hp==2){
            target.draw(2);
        }
        else{
            target.damage();
        }
    },
                ai:{
                    order:2,
                    result:{
                        target:function (player,target){
                if(player.hp>2){
                    return get.recoverEffect(target,player,target)+1;
                }
                if(player.hp==2){
                    return 2;
                }
                return get.damageEffect(target,player,target);
            },
                    },
                },
            },
            "key_qihuan":{
                limited:true,
                unique:true,
                init:function (player,skill){
        player.storage[skill]=false;
    },
                trigger:{
                    player:"dying",
                },
                priority:6,
                filter:function (event,player){
        return game.dead.length>0;
    },
                check:function (){
        return Math.random()<0.5;
    },
                skillAnimation:true,
                content:function (){
        'step 0'
        player.awakenSkill('key_qihuan');
        player.storage.key_qihuan=true;
        event.toChoose=[];
        event.choosed=[];
        event.liner=[];
        event.num=0;
        for(var i=0;i<game.dead.length;i++){
            var skills=game.dead[i].skills;
            for(var j=0;j<skills.length;j++){
                if(!event.toChoose.contains(skills[j])) event.toChoose.push(skills[j]);
            }
        }
        'step 1'
        if(!event.toChoose.length) event.finish();
        else{
            var prompt2=event.choosed.length==1?"(0/2)":"(1/2)";
            player.chooseControl(event.toChoose).set('prompt','请选择获得其中的一个技能').set('prompt2',prompt2).set('ai',function(){
                if(!event.toChoose.contains('cancel2')) return get.rand(event.toChoose.length);
                return get.rand(event.toChoose.length-1);
            });
        }
        'step 2'
        if(result.control&&result.control!='cancel2'){
            for(var i=0;i<game.dead.length;i++){
                if(game.dead[i].hasSkill(result.control)){
                    event.liner.push(game.dead[i]);break;
                }
            }
            event.choosed.push(result.control);
            event.toChoose.remove(result.control);
            if(event.choosed.length==1&&event.toChoose.length>0){
                event.toChoose.push('cancel2');
                event.goto(1);
            }
        }
        'step 3'
        var getColor=function(group){
            switch(group){
                case "wei":return "thunder";
                case "shu":return "fire";
                case "wu":return "green";
                case "qun":return {color:[255, 255, 0]};
                case "xKey":return null;
                default:return null;
            }
        }
        var liner=event.liner[event.num];
        liner.line(player,getColor(liner.group));
        player.popup(event.choosed[event.num],get.groupnature(liner.group,'raw'));
        game.log(player,'获得了',liner,'的技能',event.choosed[event.num])
        event.num++;
        game.delay();
        if(event.num<event.choosed.length) event.redo();
        'step 4'
        player.reinit('umi','umi2',player.maxHp);
        player.addSkill(event.choosed);
        player.recover(2-player.hp);
        game.delay();
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    },
                mark:true,
                intro:{
                    content:"limited",
                },
            },
            "key_kuihun":{
                trigger:{
                    global:"dying",
                },
                init:function (player,skill){
        if(player.storage[skill]==undefined) player.storage[skill]=[];
        if(player.storage.key_kuihun_suit==undefined) player.storage.key_kuihun_suit=[];
    },
                marktext:"蝶",
                intro:{
                    name:"七影蝶",
                    content:"cards",
                },
                priority:6,
                filter:function (event,player){
        return player!=event.player;
    },
                audio:"ext:Key杀:2",
                content:function (){
        "step 0"
        player.draw();
        var target=trigger.player;
        player.line(target);
        if(target.countCards('h')){
            player.chooseCardButton(target,target.getCards('h'),true);
        }else event.finish();
        "step 1"
        if(result.bool){
            var card=result.links[0];
            trigger.player.lose(result.links[0],ui.special);
            trigger.player.$give(card,player);
            player.storage.key_kuihun.push(card);
            player.storage.key_kuihun_suit.push(get.suit(card));
            player.markSkill('key_kuihun');
        }
    },
            },
            "key_jiyang":{
                trigger:{
                    player:["useCard","respond"],
                },
                init:function (player){
        if(player.storage.key_kuihun_suit==undefined) player.storage.key_kuihun_suit=[];
    },
                mod:{
                    cardUsable:function (card,player){
            if(player.storage.key_kuihun_suit.contains(get.suit(card))) return Infinity;
        },
                    targetInRange:function (card,player){
            if(player.storage.key_kuihun_suit.contains(get.suit(card))) return true;
        },
                },
                filter:function (event,player){
        if(player.storage.key_kuihun_suit==undefined) player.storage.key_kuihun_suit=[];
        return player.storage.key_kuihun_suit.contains(get.suit(event.card));
    },
                frequent:true,
                content:function (){
        player.draw();
    },
            },
            "key_shiran":{
                skillAnimation:true,
                audio:"ext:Key杀:2",
                derivation:["key_diegui"],
                unique:true,
                trigger:{
                    player:"phaseBeginStart",
                },
                filter:function (event,player){
        return player.storage.key_kuihun&&player.storage.key_kuihun.length>=player.hp&&!player.storage.key_shiran;
    },
                forced:true,
                priority:3,
                content:function (){
        player.gainMaxHp();
        player.recover();
        player.removeSkill('key_kuihun');
        player.markSkill('key_kuihun');
        player.addSkill('key_diegui');
        player.awakenSkill('key_shiran');
        player.storage.key_shiran=true;
    },
            },
            "key_diegui":{
                enable:"phaseUse",
                usable:1,
                audio:"ext:Key杀:2",
                filterTarget:function (card,playerx,targetx){
        return playerx!=targetx;
    },
                filter:function (event,player){
        if(player.storage.key_kuihun==undefined) player.storage.key_kuihun=[];
        return player.storage.key_kuihun.length>0;
    },
                content:function (){
        "step 0"
        player.chooseCardButton(player.storage.key_kuihun,true);
        "step 1"
        var card=result.links[0];
        card.discard();
        player.$give(card,target);
        target.gain(card);
        player.storage.key_kuihun.remove(card);
        if(!player.storage.key_kuihun.length){
            player.unmarkSkill('key_kuihun');
        }
        else{
            player.markSkill('key_kuihun');
        }
        player.syncStorage('key_kuihun');
        "step 2"
        target.draw(2);
        target.recover();
        player.link(false);
        player.turnOver(false);
    },
                ai:{
                    order:1,
                    result:{
                        target:function (player,target){
                var num=0;
                if(target.countCards('h')<target.hp) num+=1;
                if(target.isTurnedOver()) num+=3;
                if(target.isDamaged()&&target.hp<3) num+=2;
                return num;
            },
                    },
                },
            },
            "key_kotomi1":{
                init:function (player,skill){
        if(!player.storage[skill]) player.storage[skill]=[];
    },
                trigger:{
                    target:"useCardToBegin",
                },
                filter:function (event,player){
        return get.type(event.card)=='trick'&&player.storage.key_kotomi1.length<10;
    },
                frequent:true,
                content:function (){
        'step 0'
        event.cards=get.cards(2);
        player.chooseCardButton('【提箱】选择获得其中的一张，将另一张作为「思出」牌置于武将牌上。',true,event.cards).set('ai',function(button){
            return get.value(button.link);
        });
        'step 1'
        var togain=result.links[0];
        event.cards.remove(togain);
        player.gain(togain,'gain2');
        player.storage.key_kotomi1.push(event.cards[0]);
        player.markSkill('key_kotomi1');
    },
                marktext:"思",
                intro:{
                    name:"思出",
                    mark:function (dialog,content,player){
            if(content&&content.length){
                if(player==game.me||player.isUnderControl()){
                    dialog.addAuto(content);
                }
                else{
                    return '共有'+get.cnNumber(content.length)+'张「思出」牌';
                }
            }
        },
                    content:function (content,player){
            if(content&&content.length){
                if(player==game.me||player.isUnderControl()){
                    return get.translation(content);
                }
                return '共有'+get.cnNumber(content.length)+'张「思出」牌';
            }
        },
                },
            },
            "key_kotomi2":{
                audio:"ext:Key杀:2",
                filter:function (event,player){
        if(event.responded) return false;
        if(!event.filterCard({name:'shan'})) return false;
        if(!player.storage.key_kotomi1) return false;
        for(var i=0;i<player.storage.key_kotomi1.length;i++){
            if(get.color(player.storage.key_kotomi1[i])=='red') return true;
        }
        return false;
    },
                trigger:{
                    player:"chooseToRespondBegin",
                },
                check:function (event,player){
        if(get.damageEffect(player,event.player,player)>=0) return false;
        return true;
    },
                content:function (){
        'step 0'
        player.chooseCardButton('弃置一张红色「思出」牌，视为使用或打出一张【闪】',true,player.storage.key_kotomi1,function(button){
            return get.color(button.link)=='red';
        }).set('ai',function(button){
            return get.value(button.link);
        });
        'step 1'
        if(result.bool){
            var tothrow=result.links[0];
            player.storage.key_kotomi1.remove(tothrow);
            player.$throw(tothrow);
            tothrow.discard();
            if(player.storage.key_kotomi1.length>0) player.markSkill('key_kotomi1');
            else player.unmarkSkill('key_kotomi1');
            trigger.untrigger();
            trigger.responded=true;
            trigger.result={bool:true,card:{name:'shan'}}
        }
    },
            },
            "key_kotomi3":{
                group:["key_kotomi3_addDamage"],
                subSkill:{
                    addDamage:{
                        trigger:{
                            source:"damageBegin",
                        },
                        forced:true,
                        silent:true,
                        popup:false,
                        filter:function (event,player){
                if(player.storage.key_kotomi3>1) return false;
                return event.card.name=='wanjian'&&event.cards.length==3&&get.color(event.cards)=='black';
            },
                        content:function (){
                trigger.num++;
            },
                        sub:true,
                    },
                },
                audio:"ext:Key杀:2",
                enable:"phaseUse",
                init:function (player,skill){
        if(player.storage[skill]==undefined) player.storage[skill]=0;
    },
                filter:function (event,player){
        if(!player.storage.key_kotomi1) return false;
        return player.storage.key_kotomi1.length>0;
    },
                chooseButton:{
                    dialog:function (event,player){
            return ui.create.dialog('宇弦',player.storage.key_kotomi1,'hidden');
        },
                    filter:function (button,player){
            return get.color(button.link)=='black';
        },
                    select:3,
                    backup:function (links,player){
            return {
                filterCard:function(){return false},
                selectCard:-1,
                viewAs:{name:'wanjian'},
                cards:links,
                onuse:function(result,player){
                    player.storage.key_kotomi3++;
                    result.cards=lib.skill[result.skill].cards;
                    for(var i=0;i<result.cards.length;i++){
                        player.storage.key_kotomi1.remove(result.cards[i]);
                    }
                    player.syncStorage('key_kotomi3');
                    if(!player.storage.key_kotomi1.length){
                        player.unmarkSkill('key_kotomi1');
                    }
                    else{
                        player.markSkill('key_kotomi1');
                    }
                    player.logSkill('key_kotomi1',result.targets);
                }
            }
        },
                },
                ai:{
                    order:10,
                    result:{
                        player:1,
                    },
                },
            },
        },
        translate:{
            "key_xunjie":"迅捷",
            "key_xunjie_info":"当有角色打出基本牌响应你，或你打出基本牌后，你可以选择一名角色，然后你选择一项：1.令该角色摸一张牌；2.弃置该角色区域内的一张牌。",
            "key_yuzhao":"预兆",
            "key_yuzhao_info":"出牌阶段开始时，你可以失去任意点体力。若如此做，你的手牌上限+X，且下一次受到的伤害-X直到下回合开始。（X为你已此法失去的体力值）。",
            "key_diefan":"蝶番",
            "key_diefan_info":"出牌阶段限一次，你可以指定一名男性角色，并令其选择一项：①获得你的一张手牌，然后令你回复1点体力。②交给你一张红桃手牌，然后你令其回复1点体力。",
            "key_yuzhao2":"预兆",
            "key_yuzhao2_info":"",
            "key_baoyi":"爆衣",
            "key_baoyi_info":"当你失去一张装备牌时，你可以选择一项：①弃置一名其他男性角色的至多两张牌。②令一名其他女性角色失去1点体力。",
            "key_tuipi2":"蜕皮",
            "key_tuipi2_info":"锁定技，你不能成为【过河拆桥】或【顺手牵羊】的目标。你装备区的牌始终计入你的手牌上限。",
            "key_shuizhan":"水战",
            "key_shuizhan_info":"每回合限一次。当你使用【杀】时，你可以弃置一张牌。若此牌为红色，则此牌结算过程中所有目标角色的防具均无效且此【杀】的伤害+1；若此牌为黑色，则所有目标角色的非锁定技全部失效直到回合结束，且响应此【杀】需要的【闪】的数目+1。",
            "shuizhan_red":"水战",
            "shuizhan_red_info":"",
            "shuizhan_black":"水战",
            "shuizhan_black_info":"",
            "key_shendun":"神蹲",
            "key_shendun_info":"出牌阶段结束时，若你本阶段内未造成过伤害，则你可以选择一项：①摸两张牌 。②令一名其他角色回复1点体力。",
            "key_xunhuan":"循环",
            "key_xunhuan_info":"回合结束时，若你的手牌数小于体力值，则你可以失去1点体力，然后进行一个额外的回合。",
            "key_chaofan":"炒饭",
            "key_chaofan_info":"出牌阶段限一次。你可以弃置两张花色不同的手牌并选择一名其他角色。然后，若你的体力值：①大于2：其回复1点体力并摸一张牌；②等于2，其摸两张牌；③小于2，其受到来自你的1点伤害。",
            "key_qihuan":"七幻",
            "key_qihuan_info":"限定技，当你进入濒死状态时，若场上有已死亡的角色，则你可以失去所有技能，获得这些角色的至多两个技能。然后，你将体力回复至2点。",
            "key_kuihun":"窥魂",
            "key_kuihun_info":"当有其他角色进入濒死状态时，你可以摸一张牌，然后观看该角色的手牌并将其中的一张置于你的武将牌上，称之为「蝶」。",
            "key_jiyang":"激扬",
            "key_jiyang_info":"锁定技，当你使用或打出一张牌时，若「蝶」中有/曾有与其花色相同的牌，则你摸一张牌。你使用这些牌时没有次数和距离限制。",
            "key_shiran":"释然",
            "key_shiran_info":"觉醒技，准备阶段，若你武将牌上「蝶」的数目大于你的体力值，则你加1点体力上限并回复1点体力，失去技能〖窥魂〗并获得技能〖蝶归〗。",
            "key_diegui":"蝶归",
            "key_diegui_info":"出牌阶段限一次，你可以将一张「蝶」交给一名其他角色，该角色摸两张牌并回复1点体力，然后将武将牌复原。",
            "key_kotomi1":"提箱",
            "key_kotomi1_info":"当锦囊牌对你生效时，你可以观看牌堆顶的两张牌，获得其中的一张并将另一张背面朝上扣置于你的武将牌上，称为「思出」。",
            "key_kotomi2":"小熊",
            "key_kotomi2_info":"当你需要使用或打出一张【闪】时，你可以弃置一张红色的「思出」牌，然后视为使用或打出了一张【闪】。",
            "key_kotomi3":"宇弦",
            "key_kotomi3_info":"出牌阶段，你可以将三张黑色的「思出」牌当做【万箭齐发】使用。你于一局游戏内以此法使用的第一张【万箭齐发】的伤害+1。",
        },
    },
    intro:"",
    author:"苏婆玛丽奥",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["kotomi.jpg"],"card":[],"skill":[]}}})