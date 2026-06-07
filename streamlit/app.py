import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np

# ── Page config ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Analisis Nilai Gizi Kemasan",
    page_icon="🥗",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ────────────────────────────────────────────────────────────────
st.markdown("""
<style>
    .main-title {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1a472a;
        margin-bottom: 0.2rem;
    }
    .subtitle {
        font-size: 1rem;
        color: #555;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #e8f5e9, #f1f8e9);
        border-left: 4px solid #43a047;
        border-radius: 8px;
        padding: 1rem 1.2rem;
        margin-bottom: 0.5rem;
    }
    .badge-aman    { background-color:#2e7d32; color:white; padding:3px 10px; border-radius:12px; font-size:0.8rem; }
    .badge-waspada { background-color:#f57f17; color:white; padding:3px 10px; border-radius:12px; font-size:0.8rem; }
    .badge-batasi  { background-color:#c62828; color:white; padding:3px 10px; border-radius:12px; font-size:0.8rem; }
    div[data-testid="metric-container"] {
        background: #f9fbe7;
        border: 1px solid #dcedc8;
        border-radius: 10px;
        padding: 0.8rem 1rem;
    }
</style>
""", unsafe_allow_html=True)

# ── Load Data ─────────────────────────────────────────────────────────────────
@st.cache_data
def load_data():
    df = pd.read_csv(r"C:\project\cc26-nutriguard\streamlit\dataset_nilai_gizi_kemasan_berlabel.csv")
    return df

df = load_data()

# ── Colour maps ───────────────────────────────────────────────────────────────
RISK_COLOR = {"Aman": "#2e7d32", "Waspada": "#f57f17", "Batasi": "#c62828"}
RISK_ORDER  = ["Aman", "Waspada", "Batasi"]

# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.image("https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Nutrition_label.svg/200px-Nutrition_label.svg.png",
             width=80)
    st.markdown("## 🔍 Filter Data")

    label_options = ["Semua"] + sorted(df["label_konsumsi"].dropna().unique().tolist())
    label_filter  = st.selectbox("Label Konsumsi", label_options)

    manuf_options = ["Semua"] + sorted(df["manufacturer_clean"].dropna().unique().tolist())
    manuf_filter  = st.selectbox("Produsen", manuf_options)

    energy_range = st.slider(
        "Rentang Energi (kcal)",
        float(df["energy_kcal"].min()),
        float(df["energy_kcal"].max()),
        (float(df["energy_kcal"].min()), float(df["energy_kcal"].max())),
    )

    st.markdown("---")
    st.caption("Dataset: Nilai Gizi Kemasan Berlabel")
    st.caption(f"Total produk: **{len(df):,}**")

# ── Apply filters ─────────────────────────────────────────────────────────────
dff = df.copy()
if label_filter != "Semua":
    dff = dff[dff["label_konsumsi"] == label_filter]
if manuf_filter != "Semua":
    dff = dff[dff["manufacturer_clean"] == manuf_filter]
dff = dff[(dff["energy_kcal"] >= energy_range[0]) & (dff["energy_kcal"] <= energy_range[1])]

# ── Header ────────────────────────────────────────────────────────────────────
st.markdown('<p class="main-title">🥗 Analisis Nilai Gizi Kemasan Berlabel</p>', unsafe_allow_html=True)
st.markdown('<p class="subtitle">Dashboard eksplorasi kandungan gizi & klasifikasi risiko produk kemasan Indonesia</p>', unsafe_allow_html=True)

# ── KPI Row ───────────────────────────────────────────────────────────────────
k1, k2, k3, k4, k5 = st.columns(5)
k1.metric("Total Produk", f"{len(dff):,}")
k2.metric("Label Aman",    f"{(dff['label_konsumsi']=='Aman').sum()}")
k3.metric("Label Waspada", f"{(dff['label_konsumsi']=='Waspada').sum()}")
k4.metric("Label Batasi",  f"{(dff['label_konsumsi']=='Batasi').sum()}")
k5.metric("Rerata Energi", f"{dff['energy_kcal'].mean():.0f} kcal")

st.markdown("---")

# ══════════════════════════════════════════════════════════════════════════════
# TAB LAYOUT
# ══════════════════════════════════════════════════════════════════════════════
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "📊 Distribusi Label",
    "🧪 Kandungan Gizi",
    "⚠️ Analisis Risiko",
    "🏭 Produsen",
    "🔎 Cari Produk",
])

# ──────────────────────────────────────────────────────────────────────────────
# TAB 1 — Distribusi Label
# ──────────────────────────────────────────────────────────────────────────────
with tab1:
    st.subheader("Distribusi Label Konsumsi")

    c1, c2 = st.columns([1, 1])

    with c1:
        label_counts = dff["label_konsumsi"].value_counts().reset_index()
        label_counts.columns = ["Label", "Jumlah"]
        fig_pie = px.pie(
            label_counts, values="Jumlah", names="Label",
            color="Label",
            color_discrete_map=RISK_COLOR,
            hole=0.45,
            title="Proporsi Label Konsumsi",
        )
        fig_pie.update_traces(textinfo="percent+label", pull=[0.03]*len(label_counts))
        fig_pie.update_layout(legend_title_text="Label", height=380)
        st.plotly_chart(fig_pie, width='stretch')

    with c2:
        fig_bar = px.bar(
            label_counts.sort_values("Jumlah", ascending=True),
            x="Jumlah", y="Label",
            orientation="h",
            color="Label",
            color_discrete_map=RISK_COLOR,
            text="Jumlah",
            title="Jumlah Produk per Label",
        )
        fig_bar.update_traces(textposition="outside")
        fig_bar.update_layout(showlegend=False, height=380, xaxis_title="Jumlah Produk")
        st.plotly_chart(fig_bar, width='stretch')

    # Alasan label
    st.subheader("Top 15 Alasan Label")
    alasan = dff["alasan_label"].value_counts().head(15).reset_index()
    alasan.columns = ["Alasan", "Jumlah"]
    fig_alasan = px.bar(
        alasan.sort_values("Jumlah"),
        x="Jumlah", y="Alasan",
        orientation="h",
        color="Jumlah",
        color_continuous_scale="RdYlGn_r",
        title="Alasan Penentuan Label (Top 15)",
    )
    fig_alasan.update_layout(height=500, coloraxis_showscale=False)
    st.plotly_chart(fig_alasan, width='stretch')

# ──────────────────────────────────────────────────────────────────────────────
# TAB 2 — Kandungan Gizi
# ──────────────────────────────────────────────────────────────────────────────
with tab2:
    st.subheader("Distribusi Kandungan Gizi")

    nutrisi_cols = {
        "Energi (kcal)"     : "energy_kcal",
        "Protein (g)"       : "protein_g",
        "Karbohidrat (g)"   : "carbohydrate_g",
        "Lemak (g)"         : "fat_g",
        "Gula (g)"          : "sugar_g",
        "Natrium (mg)"      : "sodium_mg",
        "Serat (g)"         : "fiber_g",
    }

    sel_nutrisi = st.selectbox("Pilih Nutrisi", list(nutrisi_cols.keys()))
    col_name    = nutrisi_cols[sel_nutrisi]

    c1, c2 = st.columns(2)

    with c1:
        fig_hist = px.histogram(
            dff, x=col_name, color="label_konsumsi",
            color_discrete_map=RISK_COLOR,
            nbins=40,
            title=f"Distribusi {sel_nutrisi} per Label",
            barmode="overlay",
            opacity=0.75,
        )
        fig_hist.update_layout(height=380, xaxis_title=sel_nutrisi, yaxis_title="Jumlah Produk")
        st.plotly_chart(fig_hist, width='stretch')

    with c2:
        fig_box = px.box(
            dff, x="label_konsumsi", y=col_name,
            color="label_konsumsi",
            color_discrete_map=RISK_COLOR,
            category_orders={"label_konsumsi": RISK_ORDER},
            title=f"Box Plot {sel_nutrisi} per Label",
            points="outliers",
        )
        fig_box.update_layout(height=380, showlegend=False, yaxis_title=sel_nutrisi)
        st.plotly_chart(fig_box, width='stretch')

    # Scatter matrix (mini)
    st.subheader("Korelasi Antar Nutrisi")
    scatter_cols = ["energy_kcal", "protein_g", "fat_g", "carbohydrate_g", "sugar_g", "sodium_mg"]
    fig_scatter = px.scatter_matrix(
        dff, dimensions=scatter_cols,
        color="label_konsumsi",
        color_discrete_map=RISK_COLOR,
        opacity=0.5,
        title="Scatter Matrix Nilai Gizi",
        labels={c: c.replace("_", " ").title() for c in scatter_cols},
    )
    fig_scatter.update_traces(diagonal_visible=False, marker=dict(size=3))
    fig_scatter.update_layout(height=600)
    st.plotly_chart(fig_scatter, width='stretch')

# ──────────────────────────────────────────────────────────────────────────────
# TAB 3 — Analisis Risiko
# ──────────────────────────────────────────────────────────────────────────────
with tab3:
    st.subheader("Profil Risiko Produk")

    risk_cols = {
        "Energi"        : "risk_energy",
        "Lemak Total"   : "risk_fat_total",
        "Lemak Jenuh"   : "risk_saturated_fat",
        "Natrium"       : "risk_sodium",
        "Gula"          : "risk_sugar",
    }

    # Stacked bar per risk category
    risk_df_list = []
    for label, col in risk_cols.items():
        vc = dff[col].value_counts().reset_index()
        vc.columns = ["Status", "Jumlah"]
        vc["Kategori"] = label
        risk_df_list.append(vc)
    risk_all = pd.concat(risk_df_list)

    fig_risk = px.bar(
        risk_all,
        x="Kategori", y="Jumlah",
        color="Status",
        color_discrete_map=RISK_COLOR,
        barmode="group",
        title="Distribusi Status Risiko per Kategori Gizi",
        category_orders={"Status": RISK_ORDER},
    )
    fig_risk.update_layout(height=420, xaxis_title="", yaxis_title="Jumlah Produk")
    st.plotly_chart(fig_risk, width='stretch')

    # Total risk score distribution
    c1, c2 = st.columns(2)
    with c1:
        fig_score = px.histogram(
            dff, x="total_risk_score",
            color="label_konsumsi",
            color_discrete_map=RISK_COLOR,
            nbins=10,
            title="Distribusi Total Skor Risiko",
            barmode="stack",
        )
        fig_score.update_layout(height=360, xaxis_title="Total Skor Risiko", yaxis_title="Jumlah Produk")
        st.plotly_chart(fig_score, width='stretch')

    with c2:
        avg_risk = dff.groupby("label_konsumsi")[
            ["risk_energy_score","risk_fat_total_score","risk_saturated_fat_score",
             "risk_sodium_score","risk_sugar_score"]
        ].mean().T.reset_index()
        avg_risk.columns.name = None
        avg_risk = avg_risk.rename(columns={"index": "Komponen"})
        avg_risk["Komponen"] = avg_risk["Komponen"].str.replace("_score","").str.replace("_"," ").str.title()

        fig_radar_data = []
        for lbl in RISK_ORDER:
            if lbl in avg_risk.columns:
                fig_radar_data.append(go.Scatterpolar(
                    r=avg_risk[lbl].tolist() + [avg_risk[lbl].tolist()[0]],
                    theta=avg_risk["Komponen"].tolist() + [avg_risk["Komponen"].tolist()[0]],
                    fill="toself",
                    name=lbl,
                    line_color=RISK_COLOR[lbl],
                    fillcolor=RISK_COLOR[lbl],
                    opacity=0.4,
                ))
        fig_radar = go.Figure(data=fig_radar_data)
        fig_radar.update_layout(
            polar=dict(radialaxis=dict(visible=True, range=[0, 2])),
            title="Radar Rerata Skor Risiko per Label",
            height=360,
            legend_title_text="Label",
        )
        st.plotly_chart(fig_radar, width='stretch')

    # %AKG comparison
    st.subheader("Rerata % AKG per Label Konsumsi")
    akg_cols_map = {
        "Energi"       : "persen_akg_energi",
        "Protein"      : "persen_akg_protein",
        "Lemak Total"  : "persen_akg_lemak_total",
        "Karbohidrat"  : "persen_akg_karbohidrat",
        "Serat"        : "persen_akg_serat",
        "Natrium"      : "persen_akg_natrium",
    }
    akg_df = dff.groupby("label_konsumsi")[[v for v in akg_cols_map.values()]].mean().reset_index()
    akg_df = akg_df.melt(id_vars="label_konsumsi", var_name="Nutrisi", value_name="% AKG")
    akg_df["Nutrisi"] = akg_df["Nutrisi"].map({v: k for k, v in akg_cols_map.items()})
    fig_akg = px.bar(
        akg_df, x="Nutrisi", y="% AKG",
        color="label_konsumsi",
        color_discrete_map=RISK_COLOR,
        barmode="group",
        title="Rata-rata % AKG per Kategori Label",
        category_orders={"label_konsumsi": RISK_ORDER},
    )
    fig_akg.update_layout(height=400, xaxis_title="")
    st.plotly_chart(fig_akg, width='stretch')

# ──────────────────────────────────────────────────────────────────────────────
# TAB 4 — Produsen
# ──────────────────────────────────────────────────────────────────────────────
with tab4:
    st.subheader("Analisis Berdasarkan Produsen")

    top_n = st.slider("Tampilkan Top N Produsen", 5, 30, 15)

    top_manuf = (
        dff.groupby("manufacturer_clean")
           .size()
           .reset_index(name="Jumlah")
           .sort_values("Jumlah", ascending=False)
           .head(top_n)
    )

    fig_manuf = px.bar(
        top_manuf.sort_values("Jumlah"),
        x="Jumlah", y="manufacturer_clean",
        orientation="h",
        color="Jumlah",
        color_continuous_scale="Viridis",
        title=f"Top {top_n} Produsen berdasarkan Jumlah Produk",
        text="Jumlah",
    )
    fig_manuf.update_traces(textposition="outside")
    fig_manuf.update_layout(height=max(400, top_n * 28), coloraxis_showscale=False,
                             yaxis_title="", xaxis_title="Jumlah Produk")
    st.plotly_chart(fig_manuf, width='stretch')

    # Label distribution per top manufacturer
    st.subheader("Distribusi Label per Produsen (Top 10)")
    top10_manuf = top_manuf.head(10)["manufacturer_clean"].tolist()
    df_top10 = dff[dff["manufacturer_clean"].isin(top10_manuf)]
    label_manuf = (
        df_top10.groupby(["manufacturer_clean", "label_konsumsi"])
                .size()
                .reset_index(name="Jumlah")
    )
    fig_lm = px.bar(
        label_manuf,
        x="manufacturer_clean", y="Jumlah",
        color="label_konsumsi",
        color_discrete_map=RISK_COLOR,
        barmode="stack",
        title="Komposisi Label Konsumsi per Produsen (Top 10)",
        category_orders={"label_konsumsi": RISK_ORDER},
    )
    fig_lm.update_layout(
        height=420,
        xaxis_tickangle=-35,
        xaxis_title="",
        yaxis_title="Jumlah Produk",
        legend_title_text="Label",
    )
    st.plotly_chart(fig_lm, width='stretch')

# ──────────────────────────────────────────────────────────────────────────────
# TAB 5 — Cari Produk
# ──────────────────────────────────────────────────────────────────────────────
with tab5:
    st.subheader("🔎 Cari & Jelajahi Produk")

    search_term = st.text_input("Cari nama produk:", placeholder="mis. susu, biskuit, kopi ...")

    display_cols = [
        "name", "manufacturer_clean", "serving_size",
        "energy_kcal", "protein_g", "carbohydrate_g", "fat_g", "sugar_g", "sodium_mg",
        "label_konsumsi", "total_risk_score", "alasan_label",
    ]

    result = dff[display_cols].copy()
    if search_term:
        result = result[result["name"].str.contains(search_term, case=False, na=False)]

    st.caption(f"Menampilkan **{len(result):,}** produk")

    # Color rows by label
    def highlight_label(val):
        color_map = {"Aman": "#20C325", "Waspada": "#cfbe26", "Batasi": "#d23443"}
        return f"background-color: {color_map.get(val, 'white')}"

    styled = result.rename(columns={
        "name": "Produk", "manufacturer_clean": "Produsen",
        "serving_size": "Ukuran Saji",
        "energy_kcal": "Energi (kcal)", "protein_g": "Protein (g)",
        "carbohydrate_g": "Karbo (g)", "fat_g": "Lemak (g)",
        "sugar_g": "Gula (g)", "sodium_mg": "Natrium (mg)",
        "label_konsumsi": "Label", "total_risk_score": "Skor Risiko",
        "alasan_label": "Alasan Label",
    })

    st.dataframe(
        styled.style.map(highlight_label, subset=["Label"]),
        width='stretch',
        height=500,
    )

    # Product detail card
    if search_term and len(result) > 0:
        st.markdown("### Detail Produk Pertama")
        prod = result.iloc[0]
        d1, d2, d3 = st.columns(3)

        label = prod["label_konsumsi"]
        badge_class = f"badge-{label.lower()}"
        d1.markdown(f"**Produk:** {prod['name']}")
        d1.markdown(f"**Produsen:** {prod['manufacturer_clean']}")
        d1.markdown(f"**Ukuran Saji:** {prod['serving_size']}")
        d1.markdown(f"**Label:** <span class='{badge_class}'>{label}</span>", unsafe_allow_html=True)

        d2.metric("Energi",      f"{prod['energy_kcal']:.0f} kcal")
        d2.metric("Protein",     f"{prod['protein_g']:.1f} g")
        d2.metric("Karbohidrat", f"{prod['carbohydrate_g']:.1f} g")

        d3.metric("Lemak",       f"{prod['fat_g']:.1f} g")
        d3.metric("Gula",        f"{prod['sugar_g']:.1f} g")
        d3.metric("Natrium",     f"{prod['sodium_mg']:.0f} mg")

        st.info(f"📝 **Alasan Label:** {prod['alasan_label']}")

# ── Footer ────────────────────────────────────────────────────────────────────
st.markdown("---")
st.caption("🥗 Dashboard Nilai Gizi Kemasan Berlabel | Dibuat dengan Streamlit & Plotly")