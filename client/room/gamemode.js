import * as Room from 'pixel_combats/room';
import * as Basic from 'pixel_combats/basic';
import * as lib from './library.js';

const ADMIN = ["CD8BA5F2ABD9BBDA","2D2E2F256820C92","EC76560AA6B5750B","1DC1820D08403129"],
    BANNED = [],
    STATES = {
        "Waiting": 0,
        "Warmup": 1,
        "Preround": 2,
        "Round": 3,
        "Endround": 4,
        "ChangeTeams": 5,
        "Endgame": 6,
        "Clearing": 7
    },
    ENABLED = "✓",
    EMPTY = " ";

Room.BreackGraph.Damage = false;
Room.Spawns.GetContext().Enable = false;

Room.Teams.OnAddTeam.Add(function (t) {
    t.Properties.Get("loses").Value = 0;
    t.Properties.Get("wins").Value = 0;
});

function RGB(r, g, b){
    return new Basic.Color(r / 255, g / 255, b / 255, 0);
};

let CounterTerrorists = lib.CreateTeam("ct", { name: "Спецназ", undername: "Закладка бомбы от just_qstn" }, RGB(70, 130, 180), 1);
let Terrorists = lib.CreateTeam("t", { name: "Террористы", undername: "Закладка бомбы от just_qstn" }, RGB(222, 184, 135), 2)

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

Room.Teams.OnRequestJoinTeam.Add(function (p, t) {
    if (p.Properties.Get("banned").Value == null)
    {
        if (Blacklist.Value.includes(p.Id)) {
            BanPlayer(p);
        }
        else {
            p.Properties.Get("banned").Value = false;
            p.Properties.Scores.Value = 1000;
            if (p.Properties.Get("bomb").Value == null) p.Properties.Get("bomb").Value = EMPTY
            p.Properties.Get("defkit").Value = EMPTY;
        }
    }
    if (p.Properties.Get("isconnected").Value)
    {
        p.Properties.Get("banned").Value = false;
        p.Properties.Scores.Value = 1000;
        if (p.Properties.Get("bomb").Value == null) p.Properties.Get("bomb").Value = EMPTY
        p.Properties.Get("defkit").Value = EMPTY;
        p.Properties.Get("isconnected").Value = null;
    }
    JoinToTeam(p, t);
    if (!p.Spawns.IsSpawned && (State.Value == STATES.Round || State.Value == STATES.Endround)) {
        p.Spawns.Spawn();
        p.Spawns.Despawn();
        p.PopUp("Игра уже началась. Ждите конца игры");
        p.Ui.Hint.Value = "Игра уже началась, Ждите конца игры"
    } else p.Spawns.Spawn();
});

function JoinToTeam(p, t){
    let CT_Count = CounterTerrorists.Count - (p.Team == CounterTerrorists ? 1 : 0),
        T_Count = Terrorists.Count - (p.Team == Terrorists ? 1 : 0);
    if (CT_Count != T_Count) {
        if (CT_Count < T_Count) CounterTerrorists.Add(p);
        else if (CT_Count > T_Count) Terrorists.Add(p);
    }
    else t.Add(p);
}

