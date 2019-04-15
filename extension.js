game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"Key杀",content:function (config,pack){
    lib.group.push('xKey');
    lib.translate.xKey='键';
    lib.characterTitle.shiroha='key社信仰';
    lib.characterTitle.ryuichi='跳不出来的圈';
    lib.characterTitle.kobato='使命的召唤者';
    lib.characterTitle.umi='血小◆';
    lib.characterTitle.umi2='血小◆';
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            shiroha:["male","xKey",3,["key_yuzhao","key_diefan"],[]],
            ryuichi:["male","xKey",4,["key_baoyi","key_tuipi2"],[]],
            kobato:["male","xKey",4,["key_shuizhan","key_shendun"],[]],
            umi:["female","xKey",3,["key_xunhuan","key_chaofan","key_qihuan"],[]],
            "umi2":["female","xKey",3,[],["unseen","forbidai"]],
        },
        translate:{
            shiroha:"鸣濑白羽",
            ryuichi:"三谷良一",
            kobato:"鸣濑小鸠",
            umi:"加藤うみ",
            "umi2":"鹰原羽未",
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
        },
    },
    intro:"",
    author:"苏婆玛丽奥",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["umi2.jpg"],"card":[],"skill":[]}}})
