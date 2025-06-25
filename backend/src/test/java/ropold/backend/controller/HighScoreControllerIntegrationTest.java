package ropold.backend.controller;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import ropold.backend.model.HighScoreModel;
import ropold.backend.repository.HighScoreRepository;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class HighScoreControllerIntegrationTest {

    @Autowired
    private HighScoreRepository highScoreRepository;
    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        highScoreRepository.deleteAll();

        // Fester Zeitstempel für Teststabilität
        LocalDateTime fixedDate = LocalDateTime.of(2025, 3, 5, 12, 0, 0);

        HighScoreModel highScoreModel1 = new HighScoreModel(
                "1", "player1", "123456",10,0,10.2, fixedDate);
        HighScoreModel highScoreModel2 = new HighScoreModel(
                "2", "player1", "123456",10,2,14.5, fixedDate.minusMinutes(5));
        highScoreRepository.saveAll(List.of(highScoreModel1, highScoreModel2));
    }

    @Test
    void getBestHighScoresForCards10() throws Exception {
        // when & then
        mockMvc.perform(MockMvcRequestBuilders.get("/api/high-score/10"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                [
                    {
                        "id": "1",
                        "playerName": "player1",
                        "githubId": "123456",
                        "cardCount": 10,
                        "lostCardCount": 0,
                        "scoreTime": 10.2,
                        "date": "2025-03-05T12:00:00"
                    },
                    {
                        "id": "2",
                        "playerName": "player1",
                        "githubId": "123456",
                        "cardCount": 10,
                        "lostCardCount": 2,
                        "scoreTime": 14.5,
                        "date": "2025-03-05T11:55:00"
                    }
                ]"""));
    }

    @Test
    void postHighScore_shouldReturnSavedHighScore() throws Exception {
        highScoreRepository.deleteAll();

        mockMvc.perform(MockMvcRequestBuilders.post("/api/high-score")
                        .contentType("application/json")
                        .content("""
                    {
                        "id": "3",
                        "playerName": "player2",
                        "githubId": "654321",
                        "cardCount": 10,
                        "lostCardCount": 1,
                        "scoreTime": 12.0
                    }
                    """))
                .andExpect(status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.playerName").value("player2"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.githubId").value("654321"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.cardCount").value(10))
                .andExpect(MockMvcResultMatchers.jsonPath("$.lostCardCount").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.scoreTime").value(12.0))
                .andExpect(MockMvcResultMatchers.jsonPath("$.date").exists());
    }

    @Test
    void PostHighScore_withHighCount_shouldReturnNull() throws Exception{
        highScoreRepository.deleteAll();

        LocalDateTime fixedDate = LocalDateTime.of(2025, 3, 5, 12, 0, 0);

        List<HighScoreModel> existingScores = List.of(
                new HighScoreModel("1", "player1", "123456", 10, 5, 10.2, fixedDate),
                new HighScoreModel("2", "player2", "654321", 10, 5, 12.0, fixedDate.minusMinutes(5)),
                new HighScoreModel("3", "player3", "789012", 10, 5, 11.0, fixedDate.minusMinutes(10)),
                new HighScoreModel("4", "player4", "345678", 10, 5, 9.0, fixedDate.minusMinutes(15)),
                new HighScoreModel("5", "player5", "901234", 10, 5, 8.0, fixedDate.minusMinutes(20)),
                new HighScoreModel("6", "player6", "567890", 10, 5, 7.0, fixedDate.minusMinutes(25)),
                new HighScoreModel("7", "player7", "234567", 10, 5, 6.0, fixedDate.minusMinutes(30)),
                new HighScoreModel("8", "player8", "890123", 10, 5, 5.0, fixedDate.minusMinutes(35)),
                new HighScoreModel("9", "player9", "456789", 10, 5, 4.0, fixedDate.minusMinutes(40)),
                new HighScoreModel("10", "player10", "123456", 10, 5, 3.0, fixedDate.minusMinutes(45))
        );
        highScoreRepository.saveAll(existingScores);
        Assertions.assertEquals(10, highScoreRepository.count());

        mockMvc.perform(MockMvcRequestBuilders.post("/api/high-score")
                        .contentType("application/json")
                        .content("""
                    {
                        "id": "11",
                        "playerName": "player11",
                        "githubId": "111111",
                        "cardCount": 10,
                        "lostCardCount": 5,
                        "scoreTime": 20.0
                    }
                    """))
                .andExpect(status().isCreated())
                .andExpect(MockMvcResultMatchers.content().string(""));

        // THEN: Sicherstellen, dass kein zusätzlicher Eintrag gespeichert wurde
        List<HighScoreModel> allHighScores = highScoreRepository.findAll();
        Assertions.assertEquals(10, allHighScores.size()); // Anzahl der Highscores bleibt gleich
    }

    @Test
    void deleteHighScore() throws Exception {
        // Given
       mockMvc.perform(MockMvcRequestBuilders.delete("/api/high-score/1"))
                .andExpect(status().isNoContent());

        // Then
        Assertions.assertEquals(1, highScoreRepository.count());
        Assertions.assertTrue(highScoreRepository.existsById("2"));
    }
}
