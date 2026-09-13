<?php
/**
 * Shared per-question-type answer scoring — mirrors AssessmentPlayer.tsx's
 * isAnswerCorrect() exactly. Used by both assessments/submit.php (scoring a
 * new attempt) and qa/rescore-assessment-attempts.php (re-scoring historical
 * attempts against the corrected logic below, since an earlier version of
 * this function only did plain `===` and silently failed every
 * matching/ordering question).
 */
function isAssessmentAnswerCorrect(array $question, ?string $submitted): bool {
    if ($submitted === null || $submitted === '') return false;
    $type = $question['type'] ?? 'multiple-choice';

    switch ($type) {
        case 'fill-blank':
            $normalize = fn(string $s) => preg_replace('/\s+/', ' ', strtolower(trim($s)));
            $accepted = array_map($normalize, array_filter(array_merge(
                [$question['answer'] ?? ''],
                $question['acceptableAnswers'] ?? []
            )));
            return in_array($normalize($submitted), $accepted, true);

        case 'matching': {
            $picked = json_decode($submitted, true);
            $pairs = $question['pairs'] ?? null;
            if (!is_array($picked) || !is_array($pairs)) return false;
            foreach ($pairs as $i => $pair) {
                if (($picked[(string)$i] ?? null) !== ($pair['right'] ?? null)) return false;
            }
            return true;
        }

        case 'ordering': {
            $order = json_decode($submitted, true);
            $items = $question['items'] ?? null;
            if (!is_array($order) || !is_array($items) || count($order) !== count($items)) return false;
            foreach ($order as $i => $value) {
                if ($value !== $items[$i]) return false;
            }
            return true;
        }

        case 'true-false':
        case 'scenario':
        case 'multiple-choice':
        default:
            return array_key_exists('answer', $question) && $submitted === $question['answer'];
    }
}

/** @param array<string,mixed> $questions @param array<string,mixed> $answers @return array{correct:int, total:int, score:int} */
function scoreAssessmentAnswers(array $questions, array $answers): array {
    $correct = 0;
    foreach ($questions as $question) {
        $questionId = $question['id'] ?? '';
        $submitted = $answers[$questionId] ?? null;
        if (is_string($submitted) && isAssessmentAnswerCorrect($question, $submitted)) $correct++;
    }
    $total = count($questions);
    $score = $total > 0 ? min(100, max(0, (int)round(($correct / $total) * 100))) : 0;
    return ['correct' => $correct, 'total' => $total, 'score' => $score];
}
