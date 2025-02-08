import torchaudio
from audiocraft.models import AudioGen, MAGNeT
from audiocraft.data.audio import audio_write

def main():
    # model = AudioGen.get_pretrained('facebook/audiogen-medium')
    model = MAGNeT.get_pretrained("facebook/magnet-small-10secs")

    model.set_generation_params(
        use_sampling=True,
        top_k=2,
        top_p=0.9,
        temperature=3,
        max_cfg_coef=10.0,
        min_cfg_coef=1.0,
        decoding_steps=[
            int(20 * model.lm.cfg.dataset.segment_duration // 10),
            10,
            10,
            10,
        ],
        span_arrangement="stride1",
    )
        
    desc = """
    Reflective Melody: Contemplative, introspective, melodic, soul-stirring
    Narrative Journey: Evocative storytelling, lyrical narration, emotional depth
    Diverging Paths: Choices, crossroads, uncertainty, branching possibilities
    Nature's Embrace: Woodsy ambiance, rustling leaves, whispered breezes
    Exploration: Curiosity, discovery, venturing into the unknown
    Echoes of Decision: Regret, determination, acceptance, the weight of choices
    The Road Less Traveled: Adventure, risk-taking, forging one's own path
    Legacy of Choices: Impact, consequence, the ripple effect of decisions
    """

    N_VARIATIONS = 3
    descriptions = [desc for _ in range(N_VARIATIONS)]

    wav = model.generate(descriptions)  # generates 3 samples.

    for idx, one_wav in enumerate(wav):
        # Will save under {idx}.wav, with loudness normalization at -14 db LUFS.
        audio_write(f'{idx}', one_wav.cpu(), model.sample_rate, strategy="peak", loudness_compressor=True)
    
    
if __name__ == "__main__": 
    main()