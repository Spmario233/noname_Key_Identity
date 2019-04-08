game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"Key杀",content:function (config,pack){
    lib.group.push('xKey');
    lib.translate.xKey='键';
    lib.characterTitle.shiroha='key社信仰';
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            shiroha:["male","xKey",3,["key_yuzhao","key_diefan"],[]],
        },
        translate:{
            shiroha:"鸣濑白羽",
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
        },
    },
    intro:"",
    author:"苏婆玛丽奥",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["shiroha.jpg"],"card":[],"skill":[]}}})
