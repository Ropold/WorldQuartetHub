package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.HighScoreModel;
import ropold.backend.repository.HighScoreRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HighScoreService {

    private final HighScoreRepository highScoreRepository;
    private final IdService idService;

    public List<HighScoreModel> getBestHighScoresForCardCount(int cardCount) {
        return highScoreRepository.findByCardCountOrderByLostCardCountAscScoreTimeAsc(cardCount);
    }

    public HighScoreModel addHighScore(HighScoreModel highScoreModel) {

        HighScoreModel newHighScoreModel = new HighScoreModel(
                idService.generateRandomId(),
                highScoreModel.playerName(),
                highScoreModel.githubId(),
                highScoreModel.cardCount(),
                highScoreModel.lostCardCount(),
                highScoreModel.scoreTime(),
                LocalDateTime.now()
        );

        List<HighScoreModel> existingScores = highScoreRepository
                .findByCardCountOrderByLostCardCountAscScoreTimeAsc(highScoreModel.cardCount());

        if (existingScores.size() >= 10) {
            int worstIndex = existingScores.size() - 1;
            HighScoreModel worstScore = existingScores.get(worstIndex);

            boolean isBetterThanWorst = newHighScoreModel.lostCardCount() < worstScore.lostCardCount()
                    || (newHighScoreModel.lostCardCount() == worstScore.lostCardCount()
                    && newHighScoreModel.scoreTime() < worstScore.scoreTime());

            if (!isBetterThanWorst) {
                return null; // Nicht gut genug für die Top 10
            }

            highScoreRepository.deleteById(worstScore.id());
        }

        return highScoreRepository.save(newHighScoreModel);
    }



    public void deleteHighScore(String id) {
        highScoreRepository.deleteById(id);
    }
}
