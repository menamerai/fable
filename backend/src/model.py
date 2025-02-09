import torchaudio
from audiocraft.models import AudioGen, MAGNeT
from audiocraft.data.audio import audio_write


async def MAGNeT_inference(json_file: list, prompts: dict) -> None:
    # model = AudioGen.get_pretrained('facebook/audiogen-medium')
    model = MAGNeT.get_pretrained("facebook/magnet-medium-10secs")

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

    # desc = """
    # Reflective Melody: Contemplative, introspective, melodic, soul-stirring
    # Narrative Journey: Evocative storytelling, lyrical narration, emotional depth
    # Diverging Paths: Choices, crossroads, uncertainty, branching possibilities
    # Nature's Embrace: Woodsy ambiance, rustling leaves, whispered breezes
    # Exploration: Curiosity, discovery, venturing into the unknown
    # Echoes of Decision: Regret, determination, acceptance, the weight of choices
    # The Road Less Traveled: Adventure, risk-taking, forging one's own path
    # Legacy of Choices: Impact, consequence, the ripple effect of decisions
    # """

    print(f"Generating music for prompts: {prompts}")
    wav = model.generate([prompts["start"], prompts["end"]])

    for idx, one_wav in enumerate(wav):
        audio_write(
            f"./{json_file[idx]['audio_path'].with_suffix('')}",
            one_wav.cpu(),
            model.sample_rate,
            strategy="peak",
            loudness_compressor=True,
        )
