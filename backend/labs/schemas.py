from pydantic import BaseModel

class WordCounterRequest(BaseModel):
    text: str

class WordFrequency(BaseModel):
    word: str
    count: int

class WordCounterResponse(BaseModel):
    word_count: int
    char_count: int
    char_count_no_spaces: int
    frequency: list[WordFrequency]
