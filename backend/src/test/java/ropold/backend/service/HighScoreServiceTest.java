package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ropold.backend.model.HighScoreModel;
import ropold.backend.repository.HighScoreRepository;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

class HighScoreServiceTest {
    IdService idService = mock(IdService.class);
    HighScoreRepository highScoreRepository = mock(HighScoreRepository.class);
    HighScoreService highScoreService = new HighScoreService(highScoreRepository, idService);

    HighScoreModel highScoreModel1 = new HighScoreModel(
            "1",
            "Player1",
            "123456",
            10,
            2,
            15.5,
            LocalDateTime.of(2023, 10, 1, 12, 0, 0)
    );
    HighScoreModel highScoreModel2 = new HighScoreModel(
            "2",
            "Player2",
            "654321",
            10,
            1,
            12.3,
            LocalDateTime.of(2023, 10, 1, 12, 5, 0)
    );

    List<HighScoreModel> highScores = List.of(highScoreModel1, highScoreModel2);

    @BeforeEach
    void setup() {
        highScoreRepository.deleteAll();
        highScoreRepository.saveAll(highScores);
    }

    @Test
    void getBestHighScoresForCards10() {
        // Given
        when(highScoreRepository.findByCardCountOrderByLostCardCountAscScoreTimeAsc(10)).thenReturn(highScores);
        // When
        List<HighScoreModel> expected = highScoreService.getBestHighScoresForCardCount(10);
        // Then
        assertEquals(expected, highScores);
    }

    @Test
    void deleteHighScore() {
        // Given
        String idToDelete = "1";
        // When
        highScoreService.deleteHighScore(idToDelete);
        // Then
        verify(highScoreRepository, times(1)).deleteById(idToDelete);
    }

    @Test
    void addHighScore_whenOnlyTwoHighScoreAreInRepo() {
        HighScoreModel newHighScore = new HighScoreModel(
                "3",
                "Player3",
                "789012",
                10,
                0,
                10.0,
                LocalDateTime.now()
        );

        when(idService.generateRandomId()).thenReturn("3");
        when(highScoreRepository.findByCardCountOrderByLostCardCountAscScoreTimeAsc(10)).thenReturn(highScores);
        when(highScoreRepository.save(any(HighScoreModel.class))).thenReturn(newHighScore);

        HighScoreModel expected = highScoreService.addHighScore(newHighScore);

        assertEquals(expected, newHighScore);
    }

    @Test
    void addHighScore_shouldDeleteWorstHighScore_whenNewHighScoreIsBetterThanWorst() {
        highScoreRepository.deleteAll();

        LocalDateTime fixedDate = LocalDateTime.of(2025, 3, 5, 12, 0, 0);

        List<HighScoreModel> existingScores = List.of(
                new HighScoreModel("1", "Player1", "123456", 10, 2, 15.5, fixedDate),
                new HighScoreModel("2", "Player2", "654321", 10, 1, 12.3, fixedDate.minusMinutes(5)),
                new HighScoreModel("3", "Player3", "789012", 10, 0, 10.0, fixedDate.minusMinutes(10)),
                new HighScoreModel("4", "Player4", "345678", 10, 3, 20.0, fixedDate.minusMinutes(15)),
                new HighScoreModel("5", "Player5", "901234", 10, 4, 25.0, fixedDate.minusMinutes(20)),
                new HighScoreModel("6", "Player6", "567890", 10, 5, 30.0, fixedDate.minusMinutes(25)),
                new HighScoreModel("7", "Player7", "234567", 10, 6, 35.0, fixedDate.minusMinutes(30)),
                new HighScoreModel("8", "Player8", "890123", 10, 7, 40.0, fixedDate.minusMinutes(35)),
                new HighScoreModel("9", "Player9", "456789", 10, 8, 45.0, fixedDate.minusMinutes(40)),
                new HighScoreModel("10", "Player10", "123456", 10, 9, 50.0, fixedDate.minusMinutes(45))
        );

        when(highScoreRepository.findByCardCountOrderByLostCardCountAscScoreTimeAsc(10)).thenReturn(existingScores);

        HighScoreModel newHighScore = new HighScoreModel(
                "11",
                "Player11",
                "111111",
                10,
                1,
                5.0,
                LocalDateTime.now()
        );

        // Mocking der save-Methode, die den neuen Highscore zurückgibt
        when(highScoreRepository.save(any(HighScoreModel.class))).thenReturn(newHighScore);

        // When
        HighScoreModel result = highScoreService.addHighScore(newHighScore);
        assertNotNull(result);

        when(idService.generateRandomId()).thenReturn("11");
        when(highScoreRepository.save(any(HighScoreModel.class))).thenReturn(newHighScore);
    }

}
