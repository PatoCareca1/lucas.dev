from ninja import Router
from .schemas import WordCounterRequest, WordCounterResponse
from collections import Counter
import re

router = Router()

@router.post("/word-counter", response=WordCounterResponse)
def word_counter(request, payload: WordCounterRequest):
    text = payload.text
    
    # Character counts
    char_count = len(text)
    char_count_no_spaces = len(text.replace(" ", "").replace("\n", ""))
    
    # Word count and frequency
    # Using regex to find words (alphanumeric characters + optional hyphens/apostrophes)
    words = re.findall(r"\b[\w'-]+\b", text.lower())
    word_count = len(words)
    
    # Calculate frequency and get top 20
    frequency_counter = Counter(words)
    # Convert to list of dicts for the response schema
    frequency_list = [
        {"word": word, "count": count}
        for word, count in frequency_counter.most_common(20)
    ]
    
    return {
        "word_count": word_count,
        "char_count": char_count,
        "char_count_no_spaces": char_count_no_spaces,
        "frequency": frequency_list
    }
