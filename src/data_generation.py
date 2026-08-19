"""
Faili hii inatengeneza dataset ya udongo (synthetic data)
kwa kutumia mipaka ya kisayansi tuliyoipanga.
"""
import pandas as pd
import numpy as np

np.random.seed(42)


def tengeneza_kundi(n, ph_range, n_range, p_range, k_range, label):
    """Inatengeneza 'n' rows za kundi moja mahususi."""
    return pd.DataFrame({
        'ph': np.random.uniform(ph_range[0], ph_range[1], n),
        'nitrogen': np.random.uniform(n_range[0], n_range[1], n),
        'phosphorus': np.random.uniform(p_range[0], p_range[1], n),
        'potassium': np.random.uniform(k_range[0], k_range[1], n),
        'hali': label
    })


def tengeneza_dataset_udongo(n_kila_kundi=150):
    """Inaunganisha makundi yote kuwa dataset moja kamili, iliyochanganywa (shuffled)."""
    bora = tengeneza_kundi(n_kila_kundi, (6.0, 7.0), (40, 120), (20, 80), (30, 100), 'Bora')
    asidi = tengeneza_kundi(n_kila_kundi, (3.5, 5.4), (40, 120), (20, 80), (30, 100), 'Asidi Kali')
    alkali = tengeneza_kundi(n_kila_kundi, (7.6, 9.5), (40, 120), (20, 80), (30, 100), 'Alkali Kali')
    upungufu_n = tengeneza_kundi(n_kila_kundi, (6.0, 7.0), (0, 39), (20, 80), (30, 100), 'Upungufu wa Nitrogen')
    upungufu_p = tengeneza_kundi(n_kila_kundi, (6.0, 7.0), (40, 120), (0, 19), (30, 100), 'Upungufu wa Phosphorus')
    upungufu_k = tengeneza_kundi(n_kila_kundi, (6.0, 7.0), (40, 120), (20, 80), (0, 29), 'Upungufu wa Potassium')

    df = pd.concat([bora, asidi, alkali, upungufu_n, upungufu_p, upungufu_k], ignore_index=True)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    return df


# Hii inaendesha tu ikiwa faili hii inaendeshwa moja kwa moja (sio ikiwa 'imported')
if __name__ == "__main__":
    df = tengeneza_dataset_udongo()
    df.to_csv("data/udongo_dataset.csv", index=False)
    print("Dataset imehifadhiwa: data/udongo_dataset.csv")
    print(df['hali'].value_counts())