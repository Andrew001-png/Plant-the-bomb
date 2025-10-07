import * as Room from 'pixel_combats/room';
import * as Basic from 'pixel_combats/basic';
import * as lib from './library.js';

Room.BreackGraph.Damage = false;
Room.Spawns.GetContext().Enable = false;

Room.Teams.OnAddTeam.Add(function (t) {
    t.Properties.Get("loses").Value = 0;
    t.Properties.Get("wins").Value = 0;
});

let CounterTerrorists = lib.CreateTeam("ct", { name: "Спецназ", undername: "Закладка бомбы от just_qstn" }, new Basic.Color(70,130,180,0), 1);
let Terrorists = lib.CreateTeam("t", { name: "Террористы", undername: "Закладка бомбы от just_qstn" }, new Basic.Color(222,184,135,0), 2)

Room.LeaderBoard.PlayerLeaderBoardValues = [
    {
        Value: "Kills",
        DisplayName: "Убийства",
        ShortDisplayName: "Убийства"
    },
    {
        Value: "Deaths",
        DisplayName: "Смерти",
        ShortDisplayName: "Смерти"
    },
    {
        Value: "Scores",
        DisplayName: "Деньги",
        ShortDisplayName: "Деньги"
    },
    {
        Value: "bomb",
        DisplayName: "Бомба",
        ShortDisplayName: "Бомба"
    },
    {
        Value: "defkit",
        DisplayName: "Сапер",
        ShortDisplayName: "Сапер"
    }
];

Room.LeaderBoard.PlayersWeightGetter.Set(function (p) {
    return p.Properties.Get("Kills").Value;
});


