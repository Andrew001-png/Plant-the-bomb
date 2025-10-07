import * as Room from 'pixel_combats/room';
import * as Basic from 'pixdl_combats/room';
import * as lib from './library.js';

Room.Map.Rotation = Room.GameMode.Parameters.GetBool("MapRotation");
Room.BreackGraph.Damage = false;
Room.Spawns.GetContext().Enable = false;

Room.Teams.OnAddTeam.Add(function (t) {
    t.Properties.Get("loses").Value = 0;
    t.Properties.Get("wins").Value = 0;
});

let CounterTerrorists = lib.CreateTeam("ct", { name: "Спецназ", undername: "Закладка бомбы от just_qstn" }, {64, 224, 208}, 1);
let Terrorists = lib.CreateTeam("t", { name: "Террористы", undername: "Закладка бомбы от just_qstn" }, {222, 184, 135}, 2)

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

Room.Ui.TeamProp1.Value = { Team: "t", Prop: "hint" };
Room.Ui.TeamProp2.Value = { Team: "ct", Prop: "hint" };
Room.Ui.MainTimerId.Value = MainTimer.Id;

Room.Teams.OnRequestJoinTeam.Add(function (p, t) {
    if (p.Properties.Get("banned").Value == null)
    {
        p.Properties.Get("banned").Value = false;
        p.Properties.Scores.Value = DEFAULT_MONEY;
        if (p.Properties.Get("bomb").Value == null) p.Properties.Get("bomb").Value = EMPTY
        p.Properties.Get("defkit").Value = EMPTY;
    }
    if (p.Properties.Get("isconnected").Value)
    {
        p.Properties.Get("banned").Value = false;
        p.Properties.Scores.Value = DEFAULT_MONEY;
        if (p.Properties.Get("bomb").Value == null) p.Properties.Get("bomb").Value = EMPTY
        p.Properties.Get("defkit").Value = EMPTY;
        p.Properties.Get("isconnected").Value = null;
    }
    JoinToTeam(p, t);
    if (!p.Spawns.IsSpawned && (State.Value == STATES.Round || State.Value == STATES.Endround)) {
        p.Spawns.Spawn();
        p.Spawns.Despawn();
        p.PopUp("Игра уже началась. Ждите конца игры");
        p.Ui.Hint.Value="Игра уже началась. Ждите конца игры";
    } else p.Spawns.Spawn();
});

Room.Players.OnPlayerConnected.Add(function (p) {
    p.Timers.Get("join_to_team").Restart(10)
});

Room.Players.OnPlayerDisconnected.Add(function (p) {
    if (State.Value == STATES.Round) {
        if (GetAlivePlayersCount(Terrorists) == 0 && !IsPlanted.Value) return EndRound(CounterTerrorists);
        if (GetAlivePlayersCount(CounterTerrorists) == 0) return EndRound(Terrorists);
    }
});

Room.Properties.OnPlayerProperty.Add(function (c, v) {
    if (State.Value != STATES.Clearing) {
        switch (v.Name) {
            case "Scores":
                if (v.Value > MAX_MONEY) v.Value = MAX_MONEY;
                break;
            case "Deaths":
                c.Player.Team.Properties.Get("hint").Value = `< Победы: ${c.Player.Team.Properties.Get("wins").Value} >\n\n< Живых: ${(GetAlivePlayersCount(c.Player.Team))} >`;
                if (!IsPlanted.Value && GetAlivePlayersCount(c.Player.Team) <= 0) EndRound(AnotherTeam(c.Player.Team));
                if (c.Player.Team == CounterTerrorists && IsPlanted.Value && GetAlivePlayersCount(c.Player.Team) <= 0) EndRound(Terrorists);
                break;
        }
    }
});
